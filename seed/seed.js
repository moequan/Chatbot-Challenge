const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const myMovies = require("./movies.js");
const latestMovies = myMovies.latestMovies;

(async function() {
  /** CONNECT TO MONGO */
  mongoose.connect("mongodb://localhost:27017/Chatbot-challenge", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  mongoose.connection.on(
    "error",
    console.error.bind(console, "connection error:")
  );

  mongoose.connection.on("open", () => {
    console.log(`Connected to the database...`);
  });

  /** DELETE ALL MOVIES */
  try {
    await Movie.deleteMany({});
    console.log("Old movies moved to a better place. Spandau");
  } catch (e) {
    console.log(e);
  }

  console.log(`I am creating 20 fake movies`);

  /** CREATE 10 FAKE MOVIES */
  const moviePromises = Array(8)
    .fill(null)
    .map((el, i) => {
      const movie = new Movie({
        title: latestMovies[i].title,
        year: latestMovies[i].year,
        url: latestMovies[i].url
      });

      return movie.save();
    });

  try {
    await Promise.all(moviePromises);
    console.log("Movies  stored in the database!");
  } catch (e) {
    console.log(e);
  }

  mongoose.connection.close();
})();
