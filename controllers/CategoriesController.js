const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getAllCategoriesWithSortBy(req, res) {
    try {
    } catch (error) {
      return res.status(400).send(error);
    }
  }
}
module.exports = CategoriesController;
