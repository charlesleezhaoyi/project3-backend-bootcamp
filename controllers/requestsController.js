const twilo_account_Sid = process.env.DB_TWILIO_ACCOUNT_SID;
const twilo_auth_token = process.env.DB_TWILIO_AUTH_TOKEN;
const client = require("twilio")(twilo_account_Sid, twilo_auth_token);

class RequestsController {
  constructor(requestModel, donationModel, bookModel, userModel) {
    this.requestModel = requestModel;
    this.donationModel = donationModel;
    this.bookModel = bookModel;
    this.userModel = userModel;
  }
  //Need to update this function later
  async acceptRequest(req, res) {
    const { beneId, bookId } = req.body;
    try {
      await this.donationModel.update(
        { beneId: beneId },
        { where: { bookId: bookId } }
      );
      await this.requestModel.update(
        { status: "accepted" },
        { where: { beneId: beneId } }
      );
      const smsConsent = await this.userModel.findOne({
        where: { Id: beneId, smsConsent: true },
      });

      const recipientNumber = await this.userModel.findOne({
        where: { Id: beneId },
        attributes: ["phone"],
      });

      if (smsConsent) {
        client.messages.create({
          body: "Your request has been accepted. Please text this number (donor number) to arrange a pick up time & location.",
          from: process.env.DB_TWILIO_TEST_NUMBER,
          to: recipientNumber.phone,
        });
      }
      return res.json("Request accepted");
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
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
        include: { model: this.userModel, as: "bene" },
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
        include: {
          model: this.donationModel,
          include: [{ model: this.bookModel }],
        },
      });
      return res.json(requests);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = RequestsController;
