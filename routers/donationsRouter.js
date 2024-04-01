const express = require("express");
const router = express.Router();

class DonationsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/:id", this.controller.getDonations.bind(this.controller));

    return router;
  }
}

module.exports = DonationsRouter;
