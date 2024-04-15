const ValidationChecker = require("./ValidationChecker");

class DonationsController extends ValidationChecker {
  constructor(db) {
    super();
    this.donationModel = db.donation;
    this.userModel = db.user;
    this.bookModel = db.book;
  }

  async getDonorEmail(req, res) {
    const { bookId } = req.params;
    try {
      this.checkNumber(bookId, "bookId");
      const donation = await this.donationModel.findOne({
        where: {
          bookId: bookId,
        },
        include: { model: this.userModel, as: "donor" },
      });

      return res.json(donation.donor.email);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async getDonationsOnUser(req, res) {
    const { email } = req.params;
    try {
      this.checkStringFromParams(email, "email");
      const user = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      const donations = await this.donationModel.findAll({
        where: { donorId: user.id },
        include: [this.bookModel, "requests"],
      });
      return res.json(donations);
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}
module.exports = DonationsController;
