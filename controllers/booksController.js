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
    try {
      const t = await this.sequelize.transaction();
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
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: true, msg: error });
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async getBook(req, res) {
    const { id } = req.params;
    try {
      if (isNaN(Number(postId))) {
        throw new Error("Wrong Type of id");
      }
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async searchBooks(req, res) {
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

      return res.json(data);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}
module.exports = BooksController;
