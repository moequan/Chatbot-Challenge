const express = require("express");
const router = express.Router();
const { getMovies, getMovie,getRandomMovie } = require("../controllers/moviesController");

router.route("/").get(getMovies);
router.route("/proposal").get(getRandomMovie);
//   .post(auth, isAdmin, addRecord);

router.route("/:id").get(getMovie);

module.exports = router;
