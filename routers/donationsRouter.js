const express = require("express");
const router = express.Router();

class DonationsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/user/:email",
      this.controller.getDonationsOnUser.bind(this.controller)
    );
    router.get("/:id", this.controller.getDonations.bind(this.controller));

    return router;
  }
}

module.exports = DonationsRouter;
