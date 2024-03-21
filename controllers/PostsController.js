class PostsController {
  constructor(db) {
    this.post = db.post;
    this.comment = db.comment;
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
      return res.status(400).send(err);
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
    const categoryInstances = [];
    try {
      const newPost = await this.post.create(data, { transaction: t });
      for (const category of categories) {
        const categoryInstance = await this.category.findOne({
          where: { name: category },
        });
        if (!categoryInstance) {
          throw new Error(`Category name "${category}" cannot be found.`);
        }
        categoryInstances.push(categoryInstance);
      }
      await newPost.setCategories(categoryInstances, { transaction: t });
      await t.commit();
      return res.send("Create Post Completed");
    } catch (err) {
      await t.rollback();
      return res.status(400).send(err);
    }
  }

  async getComments(req, res) {}

  async createComment(req, res) {
    const { postId } = req.params;
    if (isNaN(Number(postId))) {
      return res.status(400).send("Wrong Type of postId");
    }
    const data = req.body;
    if (isNaN(Number(data.userId))) {
      return res.status(400).send("Wrong Type of userId");
    }
    if (typeof data.content !== "string") {
      return res.status(400).send("Wrong Type of content");
    }
    if (!data.content.length) {
      return res.status(400).send("Must have content for content");
    }
    try {
      const postData = await this.post.findByPk(postId);
      if (!postData) {
        throw new Error("No Such Post Found.");
      }
      await postData.createComment(data);
      return res.json("Create Comment Completed");
    } catch (err) {
      return res.status(400).send(err);
    }
  }
}
module.exports = PostsController;
