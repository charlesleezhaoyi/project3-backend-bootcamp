// const BaseController = require("./baseController");

// class UsersController extends BaseController {
//   constructor(model) {
//     super(model);
//   }

//   async insertUser(req, res) {
//     const { userEmail, firstName, lastName, phone } = req.body;

//     try {
//       const newUser = await this.model.findOrCreate({
//         where: {
//           email: userEmail,
//         },
//         first_name: firstName,
//         last_name: lastName,
//         phone: phone,
//       });

//       return res.json(newUser).json({
//         message: "User created!",
//       });
//     } catch (err) {
//       return res.status(400).json({
//         error: true,
//         msg: err,
//       });
//     }
//   }
// }
// module.exports = UsersController;

const BaseController = require("./baseController");

class UsersController extends BaseController {
  constructor(model) {
    super(model);
  }

  async insertUser(req, res) {
    const { email, firstName, lastName, phone } = req.body;

    try {
      const newUser = this.model.create({
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone,
      });
      return res.json(newUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}
module.exports = UsersController;
