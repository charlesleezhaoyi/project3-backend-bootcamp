class RequestsController {
  constructor(requestModel, donationModel, bookModel, userModel) {
    this.requestModel = requestModel;
    this.donationModel = donationModel;
    this.bookModel = bookModel;
    this.userModel = userModel;
  }

  async insertRequest(req, res) {
    const { bookId, content, email } = req.body;
    try {
      const donation = await this.donationModel.findOne({
        where: {
          bookId: bookId,
        },
      });
      const requester = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      await requester.addRequesterDonation(donation, {
        through: { content: content, status: "pending" },
      });

      return res.json("Request Created");
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllRequestOnBook(req, res) {
    const { bookId } = req.params;
    try {
      const donation = await this.donationModel.findOne({
        where: {
          bookId: bookId,
        },
      });
      const requests = await this.requestModel.findAll({
        where: { donationId: donation.id },
      });
      return res.json(requests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getAllRequestOnUser(req, res) {
    const { email } = req.params;
    try {
      const user = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      const requests = await this.requestModel.findAll({
        where: { beneId: user.id },
      });
      return res.json(requests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = RequestsController;
