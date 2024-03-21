const express = require("express");
const router = express.Router();

class PostsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/:postId/comments",
      this.controller.getComments.bind(this.controller)
    );
    router.get("/:postId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.createPost.bind(this.controller));
    router.post(
      "/:postId/comments",
      this.controller.createComment.bind(this.controller)
    );
    return router;
  }
}

module.exports = PostsRouter;
