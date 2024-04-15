const twilo_account_Sid = process.env.DB_TWILIO_ACCOUNT_SID;
const twilo_auth_token = process.env.DB_TWILIO_AUTH_TOKEN;
const client = require("twilio")(twilo_account_Sid, twilo_auth_token);
const { Op } = require("sequelize");
const Mailjet = require("node-mailjet");
const mailjet = Mailjet.apiConnect(
  process.env.MAILJET_API_KEY,
  process.env.MAILJET_SECRET_KEY
);
const mailjetRequest = mailjet.post("send", { version: "v3.1" });

class RequestsController {
  constructor(db) {
    this.requestModel = db.request;
    this.donationModel = db.donation;
    this.bookModel = db.book;
    this.userModel = db.user;
  }

  async acceptRequest(req, res) {
    const { beneId, bookId } = req.body;

    try {
      const recipient = await this.userModel.findOne({
        where: { id: beneId },
      });
      const donation = await this.donationModel.findOne({
        where: { bookId: bookId },
        include: [{ model: this.userModel, as: "donor" }, this.bookModel],
      });

      await donation.update({ beneId: beneId });

      await this.requestModel.update(
        { status: "accepted" },
        { where: { beneId: beneId } }
      );

      if (recipient.smsConsent && recipient.phone) {
        await client.messages.create({
          body: `Your request has been accepted. Please contact this number ${donation.donor.phone} or email ${donation.donor.email} to arrange a pick up time & location.`,
          from: process.env.DB_TWILIO_TEST_NUMBER,
          to: recipient.phone,
        });
      }
      if (recipient.emailConsent) {
        await mailjetRequest.request({
          Messages: [
            {
              From: {
                Email: process.env.MAILJET_SENDER,
                Name: "Book Swap",
              },
              To: [
                {
                  Email: recipient.email,
                  Name: `${recipient.firstName} ${recipient.lastName}`,
                },
              ],
              Subject: "Book request accepted notification",
              TextPart: `Congrats, Request for ${donation.book.title} is accepted by donor. Please contact this number ${donation.donor.phone} or email ${donation.donor.email} to arrange a pick up time & location.`,
            },
          ],
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

  async changeRequestStatus(req, res) {
    const { beneId, donationId, status } = req.body;
    try {
      await this.requestModel.update(
        { status: status },
        {
          where: { [Op.and]: [{ beneId: beneId }, { donationId: donationId }] },
        }
      );
      return res.json("Okay");
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
