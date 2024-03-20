const express = require("express");
const router = express.Router();

class LikesRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    return router;
  }
}

module.exports = LikesRouter;
