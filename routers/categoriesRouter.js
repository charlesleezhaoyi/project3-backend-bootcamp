const express = require("express");
const router = express.Router();

class CategoriesRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/", this.controller.getCategories.bind(this.controller));
    router.get("/:category", this.controller.getCategory.bind(this.controller));

    return router;
  }
}

module.exports = CategoriesRouter;
