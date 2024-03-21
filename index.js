const express = require("express");
const cors = require("cors");
require("dotenv").config();

// importing Routers
const UsersRouter = require("./routers/usersRouter");
const PostsRouter = require("./routers/PostsRouter");
const CategoriesRouter = require("./routers/CategoriesRouter");
const BooksRouter = require("./routers/booksRouter");

// importing Controllers
const UsersController = require("./controllers/usersController");
const PostsController = require("./controllers/PostsController");
const CategoriesController = require("./controllers/CategoriesController");
const BooksController = require("./controllers/booksController");

//importing DB
const db = require("./db/models/index");
const { user, category, book } = db;

// Initializing Controllers
const userController = new UsersController(user);
const postsController = new PostsController(db);
const categoriesController = new CategoriesController(category);
const bookController = new BooksController(book);

// Initializing Routers
const usersRouter = new UsersRouter(userController);
const postsRouter = new PostsRouter(postsController);
const categoriesRouter = new CategoriesRouter(categoriesController);
const booksRouter = new BooksRouter(bookController);

const PORT = 3000;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// Enable and use usersRouter
app.use("/users", usersRouter.routes());
app.use("/posts", postsRouter.routes());
app.use("/categories", categoriesRouter.routes());
app.use("/books", booksRouter.routes());

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
