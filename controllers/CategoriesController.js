const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model, db) {
    super(model);
    this.post = db.post;
    this.like = db.like;
    this.sequelize = db.sequelize;
  }

  async getAllCategoriesWithSortBy(req, res) {
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
        categoryOption.order = [["name", "DESC"]];
        break;
      case "popularSection":
        break;
      case "newestPost":
        break;
      case "newestComment":
        break;
    }
    return categoryOption;
  }
}
module.exports = CategoriesController;
