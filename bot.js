const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");
const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

///////////////////// BOTKIT  /////////////////////

// Import a platform-specific adapter for web.

const { WebAdapter } = require("botbuilder-adapter-web");

const { MongoDbStorage } = require("botbuilder-storage-mongodb");

// Load process.env values from .env file
require("dotenv").config();

let storage = null;
if (process.env.MONGO_URI) {
  storage = mongoStorage = new MongoDbStorage({
    url: process.env.MONGO_URI
  });
}

const adapter = new WebAdapter({});

const controller = new Botkit({
  webhook_uri: "/api/messages",
  adapter: adapter,
  storage
});

if (process.env.CMS_URI) {
  controller.usePlugin(
    new BotkitCMSHelper({
      uri: process.env.CMS_URI,
      token: process.env.CMS_TOKEN
    })
  );
}

// Once the bot has booted up its internal services, you can use them to do stuff.
controller.ready(() => {
  // load traditional developer-created local custom feature modules
  controller.loadModules(__dirname + "/features");

  /* catch-all that uses the CMS to trigger dialogs */
  if (controller.plugins.cms) {
    controller.on("message,direct_message", async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        // do not continue middleware!
        return false;
      }
    });
  }
});



/** INIT THE SERVER */
const app = express();

/** ROUTERS */
const movieRouter = require("./routes/movies");

/** CONNECT TO MONGO */

mongoose.connect("mongodb://localhost:27017/Chatbot-challenge", {
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

mongoose.connection.on("error", console.error.bind(console, "connection error:"));

//ROUTES
app.use("/movies", movieRouter);

//Kommunikation zwischen Bot und User

controller.hears("hello", "message", async (bot, message) => {
  // do something!
  await bot.reply(message, "Hello, how can I help you?");
});

controller.hears("movie", "message", async (bot, message) => {
  // do something!
  await bot.reply(message, "Here are some movies");
});
