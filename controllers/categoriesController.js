const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model, db, bookModel) {
    super(model);
    this.post = db.post;
    this.like = db.like;
    this.comment = db.comment;
    this.bookModel = bookModel;
    this.sequelize = db.sequelize;
  }

  async getCategories(req, res) {
    try {
      const categories = await this.model.findAll({
        attributes: ["id", "name"],
      });
      return res.json(categories);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getCategory(req, res) {
    const { category } = req.params;
    try {
      const selectedCategory = await this.model.findOne({
        where: {
          name: category,
        },
      });
      const selectedBooks = await selectedCategory.getBooks();
      return res.json(selectedBooks);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getSortedCategories(req, res) {
    const { sortBy } = req.params;
    const sortByList = [
      "name",
      "popularSection",
      "newestPost",
      "newestComment",
    ];
    try {
      if (!sortByList.includes(sortBy)) {
        throw new Error(
          `ValueError: ${sortBy} is not a correct value("name"/"popularSection"/"newestPost"/"newestComment")`
        );
      }
      const categoryOption = this.getCategoryOption(sortBy);
      const categories = await this.model.findAll(categoryOption);
      return res.json(categories);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  getCategoryOption(sortBy) {
    const categoryOption = {};
    switch (sortBy) {
      case "name":
        categoryOption.order = [["name", "ASC"]];
        break;
      case "popularSection":
        categoryOption.include = {
          model: this.post,
          attributes: [],
          through: { attributes: [] },
          include: [{ model: this.like, attributes: [] }],
        };
        categoryOption.group = ["category.id"];
        categoryOption.order = [
          [
            this.sequelize.fn("COUNT", this.sequelize.col("posts.likes.id")),
            "DESC",
          ],
        ];
        break;
      case "newestPost":
        categoryOption.include = {
          model: this.post,
          attributes: [],
        };
        categoryOption.order = [[this.post, "createdAt", "DESC NULLS LAST"]];
        break;
      case "newestComment":
        categoryOption.include = {
          model: this.post,
          attributes: [],
          include: [{ model: this.comment, attributes: [] }],
        };
        categoryOption.order = [
          [this.post, this.comment, "createdAt", "DESC NULLS LAST"],
        ];
        break;
    }
    return categoryOption;
  }
}
module.exports = CategoriesController;
