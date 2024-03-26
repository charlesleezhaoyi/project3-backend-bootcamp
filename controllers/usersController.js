const BaseController = require("./baseController");

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async getUserByEmail(req, res) {
    const { userEmail } = req.params;
    try {
      const user = await this.model.findOne({ where: { email: userEmail } });
      return res.json(user);
    } catch (error) {
      return res.status(400).send(error.message);
    }
  }

  async insertUser(req, res) {
    const { userEmail, firstName, lastName } = req.body;

    try {
      await this.model.findOrCreate({
        where: {
          email: userEmail,
        },
        first_name: firstName,
        last_name: lastName,
      });

      return res.status(200).json({
        message: "User created",
      });
    } catch (err) {
      return res.status(400).json({
        error: true,
        msg: err,
      });
    }
  }
}
module.exports = UsersController;
