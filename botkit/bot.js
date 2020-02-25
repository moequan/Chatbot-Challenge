//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the botkit bot.





// Import Botkit's core features
const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");
const urlMetadata = require("url-metadata");

const filterArr = [];

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

controller.hears(["hello","hallo"], "message", async (bot, message) => {
  // do something!
  await bot.reply(message, "Hello, how can I help you?");
});

controller.hears(
  ["movie","film"],
  "message",
  async (bot, response_message, response) => {
    const url = "http://localhost:8000/movies/random";
    const data = await (await fetch(url)).json();
    const metadata = await urlMetadata(data.url);
    await bot.reply(response_message, `Hier, der könnte dir gefallen: ${metadata.title}`);
    await bot.reply(response_message,`${metadata.description}`)
    await bot.reply(response_message, `<img style="width:450px; height"200px", src=${metadata.image}/>`);
  }
);
