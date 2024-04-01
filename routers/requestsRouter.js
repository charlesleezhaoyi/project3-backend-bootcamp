const express = require("express");
const router = express.Router();

class RequestsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/", this.controller.getAllRequest.bind(this.controller));
    router.post("/", this.controller.insertRequest.bind(this.controller));

    return router;
  }
}

module.exports = RequestsRouter;
