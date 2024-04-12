const express = require("express");
const router = express.Router();

class BooksRouter {
  constructor(controller, upload, checkJwt) {
    this.controller = controller;
    this.upload = upload;
    this.checkJwt = checkJwt;
  }

  routes() {
    router.post(
      "/",
      this.checkJwt,
      this.upload.array("image", 10),
      this.controller.insertBook.bind(this.controller)
    );

    router.get(
      "/",
      this.checkJwt,
      this.controller.getAllBooks.bind(this.controller)
    );
    router.get(
      "/search",
      this.controller.getRelatedBooks.bind(this.controller)
    );
    router.get(
      "/:id",
      this.checkJwt,
      this.controller.getBook.bind(this.controller)
    );
    router.get(
      "/category/:category",
      this.controller.getBookByCategory.bind(this.controller)
    );

    return router;
  }
}

module.exports = BooksRouter;
