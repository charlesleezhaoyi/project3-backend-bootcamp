const express = require("express");
const router = express.Router();

class BooksRouter {
  constructor(controller) {
    this.controller = controller;
  }

  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));
    router.post("/", this.controller.insertBook.bind(this.controller));
    router.get(
      "/listed_books",
      this.controller.getAllBooks.bind(this.controller)
    );
    router.get("/:id", this.controller.getBook.bind(this.controller));

    return router;
  }
}

module.exports = BooksRouter;
