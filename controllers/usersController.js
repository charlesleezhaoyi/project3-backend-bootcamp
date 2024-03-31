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
    const { userEmail, firstName, lastName } = req.body;

    try {
      await this.model.findOrCreate({
        where: {
          email: userEmail,
        },
        first_name: firstName,
        last_name: lastName,
      });
      return res.json("succesful!");
    } catch (err) {
      return res.status(400).json({
        error: true,
        msg: err,
      });
    }
  }
}
module.exports = UsersController;
