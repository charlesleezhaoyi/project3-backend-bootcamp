class PostsController {
  constructor(db) {
    this.post = db.post;
    this.user = db.user;
    this.like = db.like;
    this.category = db.category;
    this.sequelize = db.sequelize;
  }

  async getOne(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    try {
      const data = await this.post.findByPk(postId, {
        include: [{ model: this.user, as: "author" }, this.like],
      });
      return res.json(data);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async createPost(req, res) {
    const { categories, ...data } = req.body;
    if (isNaN(Number(data.authorId))) {
      return res.status(400).send("Wrong Type of authorId");
    }
    if (!data.title || !data.content) {
      return res.status(400).send("Must have title/content data");
    }
    if (typeof data.title !== "string" || typeof data.content !== "string") {
      return res.status(400).send("Wrong Type of title/content");
    }
    if (!data.title.length || !data.content.length) {
      return res.status(400).send("Must have content for title/content");
    }
    const t = await this.sequelize.transaction();
    try {
      const newPost = await this.post.create(data, { transaction: t });
      if (categories) {
        await this.addingCategoriesToPost(categories, newPost, t);
      }
      await t.commit();
      return res.send("Create Post Completed");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err.message);
    }
  }

  async addingCategoriesToPost(categories, post, t) {
    const categoryInstances = [];
    for (const category of categories) {
      const categoryInstance = await this.category.findOne({
        where: { name: category },
      });
      if (!categoryInstance) {
        throw new Error(`Category name "${category}" cannot be found.`);
      }
      categoryInstances.push(categoryInstance);
    }
    await post.setCategories(categoryInstances, { transaction: t });
  }

  async toggleLike(req, res) {
    const { postId, userId } = req.body;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    if (isNaN(Number(userId))) {
      return res.status(400).send("Wrong Type of userId");
    }
    try {
      const post = await this.post.findByPk(postId);
      if (!post) {
        throw new Error("No Such Post Found");
      }
      const user = await this.user.findByPk(userId);
      if (!post) {
        throw new Error("No Such User Found");
      }
      const isUserLikedPost = await post.hasLiker(user);
      await post.setLiker(isUserLikedPost ? [] : [user]);
      return res.json(
        `UserId(${userId}) ${
          isUserLikedPost ? "unliked" : "liked"
        } postId(${postId})`
      );
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}
module.exports = PostsController;
