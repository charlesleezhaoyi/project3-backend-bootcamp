const BaseController = require("./baseController");

class BooksController extends BaseController {
  constructor(model, photoModel, categoryModel) {
    super(model);
    this.photoModel = photoModel;
    this.categoryModel = categoryModel;
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

      book.addCategory(bookCategory);

      return res.json(book);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // please leave the comments here for my future reference. I will remove it eventually
  async getAllBooks(req, res) {
    try {
      const books = await this.model.findAll({
        include: this.photoModel,
        // attributes: ["title", "author", "condition"],
      });

      const booksArr = [];

      const book = books.forEach((item) => {
        console.log(item.author);
        // const title = item.title
        // const author = item.author
        // const condition = item.condition
        const singlePhoto = item.photos[0];

        const obj = {
          title: item.title,
          author: item.author,
          condition: item.condition,
          photo: singlePhoto,
        };

        booksArr.push(obj);
        // const pho = singlePhoto.forEach((item) => {
        //   console.log(item.photoUrl);
        // });
        // console.log(pho);
      });

      // const book = books.forEach((element) => {
      //   console.log(element.dataValues);
      // });
      // const photos = await books.getPhoto();
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
