const BaseController = require("./baseController");

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
      photoUrl,
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
          photos: photoUrl,
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
          {
            model: this.photoModel,
          },
          {
            model: this.categoryModel,
            right: true,
          },
        ],
      });
      return res.json(book);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = BooksController;
