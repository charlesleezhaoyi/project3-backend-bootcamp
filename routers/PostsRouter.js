const express = require("express");
const router = express.Router();

class PostsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/:postId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.createOne.bind(this.controller));
    return router;
  }
}

module.exports = PostsRouter;
