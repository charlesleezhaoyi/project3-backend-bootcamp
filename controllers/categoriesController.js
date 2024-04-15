class CategoriesController {
  constructor(db) {
    this.categoryModel = db.category;
    this.postModel = db.post;
    this.likeModel = db.like;
    this.commentModel = db.comment;
    this.sequelize = db.sequelize;
  }

  async getAll(req, res) {
    try {
      const output = await this.categoryModel.findAll();
      return res.json(output);
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
      const categories = await this.categoryModel.findAll(categoryOption);
      return res.json(categories);
    } catch (error) {
      return res.status(400).json({ error: true, msg: err });
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
          model: this.postModel,
          attributes: [],
          through: { attributes: [] },
          include: [{ model: this.likeModel, attributes: [] }],
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
          model: this.postModel,
          attributes: [],
        };
        categoryOption.order = [
          [this.postModel, "createdAt", "DESC NULLS LAST"],
        ];
        break;
      case "newestComment":
        categoryOption.include = {
          model: this.postModel,
          attributes: [],
          include: [{ model: this.commentModel, attributes: [] }],
        };
        categoryOption.order = [
          [this.postModel, this.commentModel, "createdAt", "DESC NULLS LAST"],
        ];
        break;
    }
    return categoryOption;
  }
}
module.exports = CategoriesController;
