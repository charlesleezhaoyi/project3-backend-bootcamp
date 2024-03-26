const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/:userEmail",
      this.controller.getUserByEmail.bind(this.controller)
    );
    router.post("/", this.controller.insertUser.bind(this.controller));
    return router;
  }
}

module.exports = UsersRouter;
