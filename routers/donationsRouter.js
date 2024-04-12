const express = require("express");
const router = express.Router();

class DonationsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get(
      "/user/:email",
      this.checkJwt,
      this.controller.getDonationsOnUser.bind(this.controller)
    );
    router.get(
      "/donor/:bookId",
      this.controller.getDonorEmail.bind(this.controller)
    );

    return router;
  }
}

module.exports = DonationsRouter;
