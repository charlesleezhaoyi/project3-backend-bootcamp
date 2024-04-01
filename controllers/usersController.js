const BaseController = require("./baseController");

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async insertUser(req, res) {
    const { email, firstName, lastName, phone } = req.body;

    try {
      const user = await this.model.findOrCreate({
        where: { email: email },
        defaults: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
        },
      });
      return res.json(user);
    } catch (err) {
      return res.status(400).json({
        error: true,
        msg: err,
      });
    }
  }

  async updateUser(req, res) {
    const { email, firstName, lastName, phone } = req.body;

    try {
      const updatedUser = await this.model.update(
        {
          email: email,
          firstName: firstName,
          lastName: lastName,
          phone: phone,
        },
        {
          where: {
            email: email,
          },
        }
      );

      return res.json(updatedUser);
    } catch (err) {
      return res.status(400).json({
        error: true,
        msg: err,
      });
    }
  }
}
module.exports = UsersController;
