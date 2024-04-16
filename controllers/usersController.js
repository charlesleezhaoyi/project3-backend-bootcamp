const ValidationChecker = require("./ValidationChecker");
class UsersController extends ValidationChecker {
  constructor(db) {
    super();
    this.userModel = db.user;
    this.categoryModel = db.category;
  }

  async getUserByEmail(req, res) {
    const { email } = req.params;
    try {
      this.checkStringFromParams(email, "email");
      const data = await this.userModel.findOne({ where: { email: email } });
      return res.json(data);
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: error,
      });
    }
  }

  async insertUnverifiedUser(req, res) {
    const { email } = req.body;
    try {
      this.checkStringFromBody(email, "email");
      await this.userModel.findOrCreate({
        where: {
          email: email,
        },
      });
      return res.json({
        message: "User created",
      });
    } catch (error) {
      return res.status(400).json({
        error: true,
        msg: error,
      });
    }
  }

  async updateVerifiedUser(req, res) {
    const { email, firstName, lastName, phone, smsConsent, emailConsent } =
      req.body;

    try {
      this.checkStringFromBody(email, "email");
      this.checkStringFromBody(firstName, "firstName");
      this.checkStringFromBody(lastName, "lastName");

      const user = await this.userModel.findOne({
        where: {
          email: email,
        },
      });
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      await this.userModel.update(
        { firstName, lastName, phone, smsConsent, emailConsent },
        { where: { email: email } }
      );
      return res.json({ message: "User updated successfully." });
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async addCategoryToUser(req, res) {
    const { userId, categoryId } = req.body;
    try {
      this.checkNumber(userId, "userId");
      this.checkNumber(categoryId, "categoryId");
      const user = await this.userModel.findByPk(userId);
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      const categoryInstance = await this.categoryModel.findByPk(categoryId);
      if (!categoryInstance) {
        return res.status(404).send({ message: "Category not found." });
      }
      await user.addCategory(categoryInstance);
      return res.json({ message: "Category added to user." });
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }
}

module.exports = UsersController;
