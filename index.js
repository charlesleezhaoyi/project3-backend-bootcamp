const express = require("express");
const cors = require("cors");
let multer = require("multer");
const upload = multer({ dest: "multer/" });
require("dotenv").config();
const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: process.env.DB_AUTH0_AUDIENCE,
  issuerBaseURL: process.env.DB_AUTH0_ISSUERBASEURL,
});

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

// Initializing Controllers
const userController = new UsersController(db);
const postsController = new PostsController(db);
const bookController = new BooksController(db);
const requestController = new RequestsController(db);
const commentsController = new CommentsController(db);
const donationsController = new DonationsController(db);
const categoriesController = new CategoriesController(db);

// Initializing Routers

const categoriesRouter = new CategoriesRouter(categoriesController);
const usersRouter = new UsersRouter(userController);
const postsRouter = new PostsRouter(postsController);
const booksRouter = new BooksRouter(bookController, upload);
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
app.use("/categories", checkJwt, categoriesRouter.routes());
app.use("/users", checkJwt, usersRouter.routes());
app.use("/posts", checkJwt, postsRouter.routes());
app.use("/books", checkJwt, booksRouter.routes());
app.use("/comments", checkJwt, commentsRouter.routes());
app.use("/requests", checkJwt, requestsRouter.routes());
app.use("/donations", checkJwt, donationsRouter.routes());

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
