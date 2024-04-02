const BaseController = require("./baseController");
const { Op } = require("sequelize");

class BooksController extends BaseController {
  constructor(model, photoModel, categoryModel, donationModel, userModel) {
    super(model);
    this.photoModel = photoModel;
    this.categoryModel = categoryModel;
    this.donationModel = donationModel;
    this.userModel = userModel;
  }

  async insertBook(req, res) {
    const {
      title,
      author,
      description,
      releasedYear,
      condition,
      review,
      photos,
      name,
      email,
    } = req.body;

    try {
      const book = await this.model.create(
        {
          title: title,
          author: author,
          description: description,
          releasedYear: releasedYear,
          condition: condition,
          review: review,
          photos: photos,
        },
        {
          include: ["photos"],
        }
      );
      const bookCategory = await this.categoryModel.findAll({
        where: { name: name },
      });
      const bookDonor = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      await book.addCategory(bookCategory);
      await this.donationModel.create({
        bookId: book.id,
        donorId: bookDonor.id,
      });
      return res.json(book);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await this.model.findAll({
        include: this.photoModel,
      });

      const booksArr = [];

      books.forEach((item) => {
        const singlePhoto = item.photos[0];

        const obj = {
          title: item.title,
          author: item.author,
          condition: item.condition,
          photo: singlePhoto,
        };

        booksArr.push(obj);
      });
      return res.json(booksArr);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getBook(req, res) {
    const { id } = req.params;
    try {
      const book = await this.model.findByPk(id, {
        include: [
          this.photoModel,
          this.categoryModel,
          {
            model: this.donationModel,
            include: { model: this.userModel, as: "donor" },
          },
        ],
      });
      return res.json(book);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getRelatedBooks(req, res) {
    const { searchTerm } = req.params;

    try {
      const data = await this.model.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.like]: `%${searchTerm}%` } },
            { author: { [Op.like]: `%${searchTerm}%` } },
          ],
        },
      });
      console.log(data);

      const books = data.map((book) => book.dataValues);
      res.json(books);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        message: "An error occurred while fetching the book data.",
        error: error.message,
      });
    }
  }
}
module.exports = BooksController;
