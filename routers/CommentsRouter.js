const express = require("express");
const router = express.Router();

class CommentsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/:postId/comments",
      this.controller.getComments.bind(this.controller)
    );
    router.post(
      "/:postId/comments",
      this.controller.createComment.bind(this.controller)
    );
    return router;
  }
}

module.exports = CommentsRouter;
