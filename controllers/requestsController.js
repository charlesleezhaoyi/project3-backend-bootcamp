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
const ValidationChecker = require("./ValidationChecker");

class RequestsController extends ValidationChecker {
  constructor(db) {
    super();
    this.requestModel = db.request;
    this.donationModel = db.donation;
    this.bookModel = db.book;
    this.userModel = db.user;
    this.sequelize = db.sequelize;
  }

  async acceptRequest(req, res) {
    const { beneId, bookId } = req.body;

    try {
      this.checkNumber(beneId, "beneId");
      this.checkNumber(bookId, "bookId");

      const t = await this.sequelize.transaction();
      const recipient = await this.userModel.findOne({
        where: { id: beneId },
      });
      const donation = await this.donationModel.findOne({
        where: { bookId: bookId },
        include: [{ model: this.userModel, as: "donor" }, this.bookModel],
      });

      await donation.update({ beneId: beneId }, { transaction: t });

      await this.requestModel.update(
        { status: "rejected" },
        { where: { donationId: donation.id }, transaction: t }
      );
      await this.requestModel.update(
        { status: "accepted" },
        { where: { beneId: beneId }, transaction: t }
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
      await t.commit();
      return res.json("Request accepted");
    } catch (error) {
      await t.rollback();
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async insertRequest(req, res) {
    const { bookId, content, email } = req.body;
    try {
      this.checkNumber(bookId, "bookId");
      this.checkStringFromBody(content, "content");
      this.checkStringFromBody(email, "email");
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async changeRequestStatus(req, res) {
    const { beneId, donationId, status } = req.body;

    try {
      this.checkNumber(beneId, "beneId");
      this.checkArray(donationId, "donationId");
      if (!["rejected", "cancelled", "collected"].includes(status)) {
        throw new Error("Wrong value of status");
      }
      await this.requestModel.update(
        { status: status },
        {
          where: {
            [Op.and]: [{ beneId: beneId }, { donationId: donationId }],
          },
        }
      );
      return res.json("Okay");
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async getAllRequestOnBook(req, res) {
    const { bookId } = req.params;
    try {
      this.checkNumber(bookId, "bookId");
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async getAllRequestOnUser(req, res) {
    const { email } = req.params;
    try {
      this.checkStringFromParams(email, "email");
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
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}
module.exports = RequestsController;
