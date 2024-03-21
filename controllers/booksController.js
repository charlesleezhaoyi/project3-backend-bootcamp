const BaseController = require("./baseController");

class BooksController extends BaseController {
  constructor(model) {
    super(model);
  }

  async insertBook(req, res) {
    const { title, author, description, releasedYear, condition, review } =
      req.body;

    try {
      const newBook = await this.model.create({
        title: title,
        author: author,
        description: description,
        releasedYear: releasedYear,
        condition: condition,
        review: review,
      });
      return res.json(newBook);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = BooksController;
