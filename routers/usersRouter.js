const express = require("express");
const router = express.Router();

class UsersRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get(
      "/:email",
      this.checkJwt,
      this.controller.getUserByEmail.bind(this.controller)
    );
    router.post(
      "/",
      this.checkJwt,
      this.controller.insertUnverifiedUser.bind(this.controller)
    );
    router.put(
      "/",
      this.checkJwt,
      this.controller.updateVerifiedUser.bind(this.controller)
    );
    router.post(
      "/addCategory",
      this.checkJwt,
      this.controller.addCategoryToUser.bind(this.controller)
    );
    return router;
  }
}

module.exports = UsersRouter;
