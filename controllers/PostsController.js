class PostsController {
  constructor(db) {
    this.postModel = db.post;
    this.userModel = db.user;
    this.categoryModel = db.category;
    this.commentModel = db.comment;
    this.likeModel = db.like;
    this.sequelize = db.sequelize;
  }

  async getOne(req, res) {
    const { postId } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of postId");
      }
      const data = await this.postModel.findByPk(postId, {
        include: [
          "author",
          "likes",
          "categories",
          {
            model: this.commentModel,
            include: { model: this.userModel, as: "commenter" },
          },
        ],
      });
      return res.json(data);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
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
      const categoryInstance = await this.categoryModel.findOne({
        where: { name: category },
      });
      if (!categoryInstance) {
        throw new Error(`Category: ${category} cannot be found `);
      }
      const posts = await categoryInstance.getPosts({
        joinTableAttributes: [],
        ...postsOption,
      });
      if (!!limit) {
        const offset = page ? (page - 1) * limit : 0;
        return res.json(posts.slice(offset, limit));
      }
      return res.json(posts);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  getPostsOption(sortBy) {
    const postsOption = {
      include: ["author", { model: this.likeModel, attributes: [] }],
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
    switch (sortBy) {
      case "newestPost":
        postsOption.order = [["createdAt", "DESC"]];
        break;
      case "newestComment":
        postsOption.include.push({
          model: this.commentModel,
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
    const { categories, authorEmail, ...data } = req.body;
    const t = await this.sequelize.transaction();
    try {
      if (!data.title || !data.content) {
        throw new Error("Must have title/content data");
      }
      if (typeof data.title !== "string" || typeof data.content !== "string") {
        throw new Error("Wrong Type of title/content");
      }
      if (!data.title.length || !data.content.length) {
        throw new Error("Must have content for title/content");
      }
      const author = await this.userModel.findOne({
        where: { email: authorEmail },
      });
      data.authorId = author.id;
      const newPost = await this.postModel.create(data, { transaction: t });
      if (categories) {
        await this.addingCategoriesToPost(categories, newPost, t);
      }
      await t.commit();
      return res.send(newPost);
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async addingCategoriesToPost(categories, post, t) {
    const categoryInstances = [];
    for (const category of categories) {
      const categoryInstance = await this.categoryModel.findOne({
        where: { name: category },
      });
      if (!categoryInstance) {
        throw new Error(`Category name "${category}" cannot be found.`);
      }
      categoryInstances.push(categoryInstance);
    }
    await post.setCategories(categoryInstances, { transaction: t });
  }

  async checkIsUserLikedPost(postId, userEmail) {
    if (isNaN(Number(postId))) {
      throw new Error("Wrong Type of postId");
    }
    const post = await this.postModel.findByPk(postId);
    if (!post) {
      throw new Error("No Such Post Found");
    }
    const user = await this.userModel.findOne({ where: { email: userEmail } });
    if (!post) {
      throw new Error("No Such User Found");
    }
    const isUserLikedPost = await post.hasLiker(user);
    return [isUserLikedPost, post, user];
  }

  async getIsUserLikedPost(req, res) {
    const { postId, userEmail } = req.params;
    try {
      const [isUserLikedPost] = await this.checkIsUserLikedPost(
        postId,
        userEmail
      );
      return res.json(isUserLikedPost);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async toggleLike(req, res) {
    const { postId, userEmail, like } = req.body;
    try {
      const [isUserLikedPost, post, user] = await this.checkIsUserLikedPost(
        postId,
        userEmail
      );
      if (like !== isUserLikedPost) {
        throw new Error(
          `User already ${
            isUserLikedPost ? "liked" : "unliked"
          } this post before`
        );
      }
      if (isUserLikedPost) {
        await post.removeLiker(user);
      } else {
        await post.addLiker(user);
      }
      return res.json(!isUserLikedPost);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}
module.exports = PostsController;
