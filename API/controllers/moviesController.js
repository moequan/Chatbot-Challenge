const Movie = require("../models/Movie");
// const createError = require('http-errors');

exports.getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    res.status(200).send(movies);
  } catch (e) {
    next(e);
  }
};

// Get the count of all users
exports.getRandomMovie = async (req, res, next) => {
  Movie.count().exec(async (err, count) =>{
    // Get a random entry
    var random = Math.floor(Math.random() * count);

    // Again query all users but only fetch one offset by our random #
   const movie =  await Movie.findOne()
      .skip(random)
      res.status(200).send(movie);
      
  });
};
