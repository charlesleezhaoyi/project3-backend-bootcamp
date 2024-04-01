const BaseController = require("./baseController");

class UsersController extends BaseController {
  constructor(model, category) {
    super(model);
    this.category = category;
  }

  async insertUnverifiedUser(req, res) {
    const { userEmail } = req.body;

    try {
      await this.model.findOrCreate({
        where: {
          email: userEmail,
        },
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

  async updateVerifiedUser(req, res) {
    const { userEmail, firstName, lastName, phone } = req.body;

    try {
      const user = await this.model.findOne({
        where: {
          email: userEmail,
        },
      });

      if (user) {
        await this.model.update(
          { firstName, lastName, phone },
          { where: { email: userEmail } }
        );

        return res.status(200).send({ message: "User updated successfully." });
      } else {
        return res.status(404).send({ message: "User not found." });
      }
    } catch (error) {
      return res
        .status(500)
        .send({ message: "Error updating user.", error: error.message });
    }
  }

  async addCategoryToUser(req, res) {
    const { userId, categoryId } = req.body;

    try {
      const user = await this.model.findOne({
        where: {
          id: userId,
        },
      });

      console.log(userId);
      console.log(user);

      if (user) {
        const categoryInstance = await this.category.findByPk(categoryId);

        if (categoryInstance) {
          await user.addCategory(categoryInstance);
          return res.status(200).send({ message: "Category added to user." });
        } else {
          return res.status(404).send({ message: "Category not found." });
        }
      } else {
        return res.status(404).send({ message: "User not found." });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error adding category to user.",
        error: error.message,
      });
    }
  }
}

module.exports = UsersController;
