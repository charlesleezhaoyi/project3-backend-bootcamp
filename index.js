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

// const checkScopes = requiredScopes("read:messages");

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
const { user, category, book, comment, post, request, donation } = db;

// Initializing Controllers
// Controllers with checkJwt
const userController = new UsersController(user, category);
const postsController = new PostsController(db);
const bookController = new BooksController(db);
const requestController = new RequestsController(request, donation, book, user);
const commentsController = new CommentsController(comment, post, user);
const donationsController = new DonationsController(donation, user, book);

//Controllers without checkJwt
const categoriesController = new CategoriesController(category, db, book);

// Initializing Routers
const usersRouter = new UsersRouter(userController);
const postsRouter = new PostsRouter(postsController, checkJwt);
const categoriesRouter = new CategoriesRouter(categoriesController);
const booksRouter = new BooksRouter(bookController, upload, checkJwt);
const commentsRouter = new CommentsRouter(commentsController, checkJwt);
const requestsRouter = new RequestsRouter(requestController, checkJwt);
const donationsRouter = new DonationsRouter(donationsController, checkJwt);

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
