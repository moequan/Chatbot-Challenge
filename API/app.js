/** EXTERNAL DEPENDENCIES */
const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");

/** ROUTERS */
const moviesRouter = require("./routes/movies");

/** OUR MIDDLEWARE */
const cors = require("cors");

/** INIT THE SERVER */
const app = express();

/** LOGS */
app.use(logger("dev"));

/** CONNECT TO MONGO */
mongoose.connect("mongodb://localhost:27017/movies-api", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

mongoose.connection.on(
  "error",
  console.error.bind(console, "connection error:")
);

mongoose.connection.on("open", () => {
  console.log(`Connected to the database...`);
});

/** REQUEST PARSERS */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: ["*"],
    credentials: true
  })
);

/** STATIC FILES */
app.use(express.static(path.join(__dirname, "public")));

/** ROUTES */
app.use("/movies", moviesRouter);

/** ERROR HANDLING */
app.use(function(req, res, next) {
  const err = new Error("Looks like something is broken...");
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(400).send({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
