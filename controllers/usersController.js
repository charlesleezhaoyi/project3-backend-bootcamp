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

      return res.status(200).json({
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

      if (user) {
        await this.userModel.update(
          { firstName, lastName, phone, smsConsent, emailConsent },
          { where: { email: email } }
        );
        console.log(req.body);

        return res.status(200).send({ message: "User updated successfully." });
      } else {
        return res.status(404).send({ message: "User not found." });
      }
    } catch (error) {
      return res.status(400).json({ error: true, msg: error });
    }
  }

  async addCategoryToUser(req, res) {
    const { userId, categoryId } = req.body;

    try {
      const user = await this.userModel.findOne({
        where: {
          id: userId,
        },
      });

      console.log(userId);
      console.log(user);

      if (user) {
        const categoryInstance = await this.categoryModel.findByPk(categoryId);

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
      return res.status(400).json({ error: true, msg: error });
    }
  }
}

module.exports = UsersController;
