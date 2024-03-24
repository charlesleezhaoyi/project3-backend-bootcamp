const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.post(
      "/",
      this.controller.insertUnverifiedUser.bind(this.controller)
    );
    router.put("/", this.controller.updateVerifiedUser.bind(this.controller));
    router.post(
      "/addCategory",
      this.controller.addCategoryToUser.bind(this.controller)
    );
    return router;
  }
}

module.exports = UsersRouter;
