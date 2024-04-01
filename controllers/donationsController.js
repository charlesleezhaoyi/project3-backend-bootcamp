class DonationsController {
  constructor(donationModel, userModel, bookModel) {
    this.donationModel = donationModel;
    this.userModel = userModel;
    this.bookModel = bookModel;
  }

  async getDonations(req, res) {
    const { id } = req.params;
    try {
      const donor = await this.model.findOne({
        where: {
          bookId: id,
        },
        attributes: ["donor_id"],
      });

      const donorId = await donor.dataValues.donor_id;

      const donorEmail = await this.userModel.findByPk(donorId, {
        attributes: ["email"],
      });

      return res.json(donorEmail);
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
        include: [{ model: this.bookModel, include: "photos" }],
      });
      return res.json(donations);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = DonationsController;
