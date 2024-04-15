class UsersController {
  constructor(db) {
    this.userModel = db.user;
    this.categoryModel = db.category;
  }

  async getUserByEmail(req, res) {
    const { email } = req.params;
    try {
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
      if (isNaN(Number(userId))) {
        throw new Error("Wrong Type of userId");
      }
      if (isNaN(Number(categoryId))) {
        throw new Error("Wrong Type of categoryId");
      }
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
