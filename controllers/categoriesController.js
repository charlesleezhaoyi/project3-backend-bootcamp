const BaseController = require("./baseController");

class CategoriesController extends BaseController {
  constructor(model, bookModel) {
    super(model);
    this.bookModel = bookModel;
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
}
module.exports = CategoriesController;
