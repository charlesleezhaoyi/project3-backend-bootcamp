const express = require("express");
const cors = require("cors");
require("dotenv").config();

// importing Routers
const UsersRouter = require("./routers/usersRouter");
const BooksRouter = require("./routers/booksRouter");
const CategoriesRouter = require("./routers/categoriesRouter");
const RequestsRouter = require("./routers/requestsRouter");

// importing Controllers
const UsersController = require("./controllers/usersController");
const BooksController = require("./controllers/booksController");
const CategoriesController = require("./controllers/categoriesController");
const RequestsController = require("./controllers/requestsController");

//importing DB
const db = require("./db/models/index");
const { user, book, photo, category, request } = db;

// Initializing Controllers
const userController = new UsersController(user);
const bookController = new BooksController(book, photo, category);
const categoryController = new CategoriesController(category, book);
const requestController = new RequestsController(request, book);

// Initializing Routers
const usersRouter = new UsersRouter(userController);
const booksRouter = new BooksRouter(bookController);
const categoriesRouter = new CategoriesRouter(categoryController);
const requestsRouter = new RequestsRouter(requestController);

const PORT = 3000;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// Enable and use usersRouter
app.use("/users", usersRouter.routes());
app.use("/books", booksRouter.routes());
app.use("/categories", categoriesRouter.routes());
app.use("/request", requestsRouter.routes());

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
