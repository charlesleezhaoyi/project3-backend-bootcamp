const express = require("express");
const router = express.Router();

class BooksRouter {
  constructor(controller, upload) {
    this.controller = controller;
    this.upload = upload;
  }

  routes() {
    router.post(
      "/",
      this.upload.array("image", 10),
      this.controller.insertBook.bind(this.controller)
    );
    router.get("/", this.controller.getAllBooks.bind(this.controller));
    router.get("/:id", this.controller.getBook.bind(this.controller));
    router.get(
      "/search/:searchTerm",
      this.controller.getRelatedBooks.bind(this.controller)
    );

    return router;
  }
}

module.exports = BooksRouter;
