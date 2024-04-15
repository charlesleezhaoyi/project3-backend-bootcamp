class DonationsController {
  constructor(db) {
    this.donationModel = db.donation;
    this.userModel = db.user;
    this.bookModel = db.book;
  }

  async getDonorEmail(req, res) {
    const { bookId } = req.params;
    try {
      const donation = await this.donationModel.findOne({
        where: {
          bookId: bookId,
        },
        include: { model: this.userModel, as: "donor" },
      });

      return res.json(donation.donor.email);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  async getDonationsOnUser(req, res) {
    const { email } = req.params;
    try {
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
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = DonationsController;
