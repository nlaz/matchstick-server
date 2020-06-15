const express = require("express");
const session = require("express-session");
const compression = require("compression");
const logger = require("morgan");
const cors = require("cors");

const config = require("../config");
const paths = require("../config/paths");
const routes = require("./routes");

// Set up the express app
const app = express();

// Log requests to the console.
app.use(logger("dev"));
app.use(cors());

// Will attempt to compress responses.
app.use(compression());

// Parse incoming requests data.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up session middleware
const options = {
  secret: config.secretKey,
  saveUninitialized: true,
  resave: true,
};
app.use(session(options));
app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

// Smoke route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

routes.registerRoutes(app);
routes.registerErrorHandlers(app);

app.listen(config.port, () => {
  console.log(`🚀 Server started on port ${config.port}.`);
});
