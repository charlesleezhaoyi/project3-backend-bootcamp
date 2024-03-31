const BaseController = require("./baseController");

class RequestsController extends BaseController {
  constructor(model, bookModel) {
    super(model);
    this.bookModel = bookModel;
  }

  async insertRequest(req, res) {
    const { id, title } = req.params;
    const { content } = req.body;
    try {
      // const requestedBook = await this.bookModel.findOne({
      //   where: {
      //     id: id,
      //     title: title,
      //   },
      // });

      const requestedContent = await this.model.create({
        content: content,
      });

      return res.json(requestedContent);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllRequest(req, res) {
    try {
      const requests = await this.model.findAll({});

      return res.json(requests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = RequestsController;
