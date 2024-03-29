const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model) {
    super(model);
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
}
module.exports = CategoriesController;
