const BaseController = require("./baseController");

class RequestsController extends BaseController {
  constructor(model, donationModel, bookModel, userModel) {
    super(model);
    this.donationModel = donationModel;
    this.bookModel = bookModel;
    this.userModel = userModel;
  }

  async insertRequest(req, res) {
    const { id } = req.params;
    const { content, email } = req.body;
    try {
      const donationId = await this.donationModel.findOne({
        where: {
          book_id: id,
        },
        attributes: ["id"],
      });

      const donorpk = await donationId.dataValues.id;
      const bookDonor = await this.userModel.findOne({
        where: {
          email: email,
        },
        attributes: ["id"],
      });
      const userpk = await bookDonor.dataValues.id;

      return res.json("Request submitted successfully!");
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
