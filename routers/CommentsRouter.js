const express = require("express");
const router = express.Router();

class CommentsRouter {
  constructor(controller, checkJwt) {
    this.controller = controller;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.get(
      "/:postId",
      this.checkJwt,
      this.controller.getComments.bind(this.controller)
    );
    router.post(
      "/:postId",
      this.checkJwt,
      this.controller.createComment.bind(this.controller)
    );
    return router;
  }
}

module.exports = CommentsRouter;
