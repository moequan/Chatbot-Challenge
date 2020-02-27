const Movie = require("../models/Movie");

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(200).send(movies);
  } catch (e) {
    next(e);
  }
};

exports.getRandomMovie = async (req, res, next) => {
  Movie.count().exec(async (err, count) => {
    var random = Math.floor(Math.random() * count);
    const movie = await Movie.findOne().skip(random);
    res.status(200).send(movie);
  });
};
