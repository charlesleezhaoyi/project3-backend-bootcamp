const express = require("express");
const cors = require("cors");
require("dotenv").config();

// importing Routers
const UsersRouter = require("./routers/usersRouter");
const PostsRouter = require("./routers/PostsRouter");
const CategoriesRouter = require("./routers/categoriesRouter");
const BooksRouter = require("./routers/booksRouter");
const RequestsRouter = require("./routers/requestsRouter");
const CommentsRouter = require("./routers/CommentsRouter");
const DonationsRouter = require("./routers/donationsRouter");

// importing Controllers
const UsersController = require("./controllers/usersController");
const PostsController = require("./controllers/PostsController");
const CategoriesController = require("./controllers/categoriesController");
const BooksController = require("./controllers/booksController");
const RequestsController = require("./controllers/requestsController");
const CommentsController = require("./controllers/CommentsController");
const DonationsController = require("./controllers/donationsController");

//importing DB
const db = require("./db/models/index");
const { user, category, book, comment, post, photo, request, donation } = db;

// Initializing Controllers
const userController = new UsersController(user, category);
const postsController = new PostsController(db);
const categoriesController = new CategoriesController(category, db, book);
const bookController = new BooksController(
  book,
  photo,
  category,
  donation,
  user
);
const requestController = new RequestsController(request, donation, book, user);
const commentsController = new CommentsController(comment, post, user);
const donationsController = new DonationsController(donation, user, book);

// Initializing Routers
const usersRouter = new UsersRouter(userController);
const postsRouter = new PostsRouter(postsController);
const categoriesRouter = new CategoriesRouter(categoriesController);
const booksRouter = new BooksRouter(bookController);
const commentsRouter = new CommentsRouter(commentsController);
const requestsRouter = new RequestsRouter(requestController);
const donationsRouter = new DonationsRouter(donationsController);

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
app.use("/comments", commentsRouter.routes());
app.use("/categories", categoriesRouter.routes());
app.use("/requests", requestsRouter.routes());
app.use("/donations", donationsRouter.routes());

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
