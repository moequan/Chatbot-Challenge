const express = require("express");
const router = express.Router();
const {
  getMovies,
  getRandomMovie
} = require("../controllers/moviesController");

router.route("/").get(getMovies);
router.route("/random").get(getRandomMovie);

module.exports = router;
