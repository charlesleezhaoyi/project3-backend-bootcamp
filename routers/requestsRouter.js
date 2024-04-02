const express = require("express");
const router = express.Router();

class RequestsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/book/:bookId",
      this.controller.getAllRequestOnBook.bind(this.controller)
    );
    router.get(
      "/user/:email",
      this.controller.getAllRequestOnUser.bind(this.controller)
    );
    router.post("/", this.controller.insertRequest.bind(this.controller));
    router.post("/accept", this.controller.acceptRequest.bind(this.controller));
    return router;
  }
}

module.exports = RequestsRouter;
