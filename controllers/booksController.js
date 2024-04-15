const { Op } = require("sequelize");
const fs = require("fs");

class BooksController {
  constructor(db) {
    this.bookModel = db.book;
    this.photoModel = db.photo;
    this.categoryModel = db.category;
    this.donationModel = db.donation;
    this.userModel = db.user;
    this.sequelize = db.sequelize;
  }

  async insertBook(req, res) {
    const { categories, email, ...data } = JSON.parse(req.body.data);
    const t = await this.sequelize.transaction();
    try {
      const book = await this.bookModel.create(data, { transaction: t });
      for (const [index, { path }] of req.files.entries()) {
        const photoBinaryData = fs.readFileSync(path);
        await this.photoModel.create(
          {
            index: index,
            bookId: book.id,
            file: photoBinaryData,
          },
          { transaction: t }
        );
        fs.unlinkSync(path);
      }

      const bookCategory = await this.categoryModel.findAll({
        where: { name: categories },
      });
      const bookDonor = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      await book.addCategories(bookCategory, { transaction: t });
      await this.donationModel.create(
        {
          bookId: book.id,
          donorId: bookDonor.id,
        },
        { transaction: t }
      );

      await t.commit();
      return res.json(book);
    } catch (err) {
      await t.rollback();
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllBooks(req, res) {
    try {
      const books = await this.bookModel.findAll({
        include: {
          model: this.photoModel,
          where: { index: 0 },
          required: false,
        },
      });
      return res.json(books);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getBookByCategory(req, res) {
    const { category } = req.params;
    try {
      const selectedBooks = await this.bookModel.findAll({
        include: [
          { model: this.categoryModel, where: { name: category } },
          {
            model: this.photoModel,
            where: { index: 0 },
            required: false,
          },
        ],
      });
      return res.json(selectedBooks);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getBook(req, res) {
    const { id } = req.params;
    try {
      const book = await this.bookModel.findByPk(id, {
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

  async searchBooks(req, res) {
    // const { searchTerm } = req.params;
    const info = req.query.q;
    try {
      const data = await this.bookModel.findAll({
        where: {
          [Op.or]: [
            { title: { [Op.iLike]: `%${info}%` } },
            { author: { [Op.iLike]: `%${info}%` } },
          ],
        },
        include: this.photoModel,
      });
      console.log(data);

      // const books = data.map((book) => book.dataValues);
      // console.log(books);
      return res.json(data);
      // res.status(200).json(data);
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
