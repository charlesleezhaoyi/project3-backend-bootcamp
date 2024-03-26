class PostsController {
  constructor(db) {
    this.post = db.post;
    this.user = db.user;
    this.category = db.category;
    this.comment = db.comment;
    this.like = db.like;
    this.sequelize = db.sequelize;
  }

  async getOne(req, res) {
    const { postId } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      const data = await this.post.findByPk(postId, {
        include: ["author", "likes", "categories"],
      });
      return res.json(data);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }

  async getPostsFromCategory(req, res) {
    const { category } = req.params;
    let { sortBy, limit, page } = req.query;
    const sortByList = ["newestPost", "newestComment", "popular"];
    try {
      if (!!limit && isNaN(Number(limit))) {
        throw new Error("Wrong type of limit");
      }
      if (!!page && isNaN(Number(page))) {
        throw new Error("Wrong type of page");
      }
      if (!!page && !limit) {
        throw new Error("Must have limit for page");
      }
      if (!!sortBy && !sortByList.includes(sortBy)) {
        throw new Error(
          `ValueError: Wrong value of sortBy ("newestPost"/"newestComment"/"popular")`
        );
      }
      const postsOption = this.getPostsOption(sortBy, limit, page);
      const categoryInstance = await this.category.findOne({
        where: { name: category },
      });
      if (!categoryInstance) {
        throw new Error(`Category: ${category} cannot be found `);
      }
      const posts = await categoryInstance.getPosts({
        joinTableAttributes: [],
        ...postsOption,
      });
      return res.json(posts);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  getPostsOption(sortBy, limit, page) {
    const postsOption = {
      include: ["author", { model: this.like, attributes: [] }],
      group: ["post.id", "author.id"],
      attributes: {
        include: [
          [
            this.sequelize.fn("COUNT", this.sequelize.col("likes.id")),
            "likeCount",
          ],
        ],
      },
    };
    if (!!limit && !page) {
      page = 1;
    }
    if (!!limit) {
      const offset = (page - 1) * limit;
      postsOption.offset = offset;
      postsOption.limit = limit;
    }
    switch (sortBy) {
      case "newestPost":
        postsOption.order = [["createdAt", "DESC"]];
        break;
      case "newestComment":
        postsOption.include.push({
          model: this.comment,
          attributes: [],
        });
        postsOption.group.push("comments.created_at");
        postsOption.order = [["comments", "createdAt", "DESC"]];
        break;
      case "popular":
        postsOption.order = [["likeCount", "DESC"]];
        break;
    }
    return postsOption;
  }

  async createPost(req, res) {
    const { categories, ...data } = req.body;
    const t = await this.sequelize.transaction();
    try {
      if (isNaN(Number(data.authorId))) {
        throw new Error("Wrong Type of authorId");
      }
      if (!data.title || !data.content) {
        throw new Error("Must have title/content data");
      }
      if (typeof data.title !== "string" || typeof data.content !== "string") {
        throw new Error("Wrong Type of title/content");
      }
      if (!data.title.length || !data.content.length) {
        throw new Error("Must have content for title/content");
      }

      const newPost = await this.post.create(data, { transaction: t });
      if (categories) {
        await this.addingCategoriesToPost(categories, newPost, t);
      }
      await t.commit();
      return res.send(newPost);
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
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      if (isNaN(Number(userId))) {
        throw new Error("Wrong Type of userId");
      }
      const post = await this.post.findByPk(postId);
      if (!post) {
        throw new Error("No Such Post Found");
      }
      const user = await this.user.findByPk(userId);
      if (!post) {
        throw new Error("No Such User Found");
      }
      const isUserLikedPost = await post.hasLiker(user);
      if (isUserLikedPost) {
        await post.removeLiker(user);
      } else {
        await post.addLiker(user);
      }
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
