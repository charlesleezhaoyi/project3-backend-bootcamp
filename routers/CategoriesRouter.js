const express = require("express");
const router = express.Router();

class CategoriesRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/all", this.controller.getAll.bind(this.controller));
    router.get(
      "/all/sort/:sortBy",
      this.controller.getSortedCategories.bind(this.controller)
    );
    return router;
  }
}

module.exports = CategoriesRouter;
