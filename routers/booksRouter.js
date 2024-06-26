const express = require("express");
const router = express.Router();

class BooksRouter {
  constructor(controller, upload) {
    this.controller = controller;
    this.upload = upload;
  }

  routes() {
    router.get("/", this.controller.getAllBooks.bind(this.controller));
    router.get("/search", this.controller.searchBooks.bind(this.controller));
    router.get("/:bookId", this.controller.getBook.bind(this.controller));
    router.get(
      "/category/:category",
      this.controller.getBookByCategory.bind(this.controller)
    );
    router.post(
      "/",
      this.upload.array("image", 10),
      this.controller.insertBook.bind(this.controller)
    );
    return router;
  }
}

module.exports = BooksRouter;
