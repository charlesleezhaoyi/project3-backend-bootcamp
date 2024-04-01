const BaseController = require("./baseController");

class DonationsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
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
}
module.exports = DonationsController;
