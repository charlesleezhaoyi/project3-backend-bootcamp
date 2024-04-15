const express = require("express");
const router = express.Router();

class PostsRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get(
      "/category/:category",
      this.controller.getPostsFromCategory.bind(this.controller)
    );
    router.get(
      "/like/:postId/:userEmail",
      this.controller.getIsUserLikedPost.bind(this.controller)
    );
    router.get("/:postId", this.controller.getOne.bind(this.controller));
    router.post("/", this.controller.createPost.bind(this.controller));
    router.put("/like", this.controller.toggleLike.bind(this.controller));
    return router;
  }
}

module.exports = PostsRouter;
