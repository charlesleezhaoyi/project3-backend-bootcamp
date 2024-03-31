const BaseController = require("./baseController");
const { Sequelize, Op } = require("sequelize");

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

  //To Test
  async getRelatedBooks(req, res) {
    const { title, author, description } = req.body;

    try {
      const data = await this.model.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${title}%` } },
            { author: { [Op.like]: `%${author}%` } },
            { description: { [Op.like]: `%${description}%` } },
          ],
        },
      });

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({
        message: "An error occurred while fetching the book data.",
        error: error.message,
      });
    }
  }

  async getAllBooks(req, res) {
    try {
      const data = await this.post.findAll();
      return res.json(data);
    } catch (err) {
      return res.status(400).send(err.message);
    }
  }
}
module.exports = BooksController;
