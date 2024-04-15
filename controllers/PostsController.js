const ValidationChecker = require("./ValidationChecker");
class PostsController extends ValidationChecker {
  constructor(db) {
    super();
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
      this.checkNumber(postId, "postId");
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
      this.checkStringFromParams(category, "category");
      if (limit) {
        this.checkNumber(limit, "limit");
      }
      if (page) {
        this.checkNumber(page, "page");
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
      this.checkStringFromBody(authorEmail, "authorEmail");
      this.checkStringFromBody(data.title, "title");
      this.checkStringFromBody(data.content, "content");
      this.checkArray(categories, "categories");
      const author = await this.userModel.findOne({
        where: { email: authorEmail },
      });
      data.authorId = author.id;
      const newPost = await this.postModel.create(data, { transaction: t });
      await this.addingCategoriesToPost(categories, newPost, t);
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
      this.checkNumber(postId, "postId");
      this.checkStringFromParams(userEmail, "userEmail");
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
      this.checkNumber(postId, "postId");
      this.checkStringFromBody(userEmail, "userEmail");
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
