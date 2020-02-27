const { Botkit } = require("botkit");
const { BotkitCMSHelper } = require("botkit-plugin-cms");
const urlMetadata = require("url-metadata");


const { WebAdapter } = require("botbuilder-adapter-web");

const { MongoDbStorage } = require("botbuilder-storage-mongodb");

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

controller.ready(() => {
  controller.loadModules(__dirname + "/features");

  if (controller.plugins.cms) {
    controller.on("message,direct_message", async (bot, message) => {
      let results = false;
      results = await controller.plugins.cms.testTrigger(bot, message);

      if (results !== false) {
        return false;
      }
    });
  }
});

//  Quick reply Option

var reply = {
  text: "Wie kann ich dir weiterhelfen?",
  quick_replies: [
    {
      title: "Einen Film vorschlagen",
      payload: "movie",
      typing: true
    },
    {
      title: "Ich bin gerade wunschlos glücklich!",
      payload: "Nein"
    }
  ]
};

controller.hears(
  ["hello", "hallo", "Guten Tag"],
  "message",
  async (bot, message) => {
    await bot.reply(message, reply);
  }
);

controller.hears(
  ["Einen Film vorschlagen", "movie", "film", "Schlag mir einen Film vor"],
  "message",
  async (bot, response_message, response) => {
   

    const url = "https://movies-api-coral.now.sh/movies/random";
    const data = await (await fetch(url)).json();
    const metadata = await urlMetadata(data.url);

    await bot.reply(
      response_message,
      `<div style="text-align:center"><p style="font-weight:bold">Hier, der könnte dir gefallen: ${metadata.title}</p><p>${metadata.description}"</p>  <a href="${metadata.url}">Hier findest du alle weiteren Informationen</a> :) </div>`,
      
    );
  }
);

controller.hears(["Nein"], "message", async (bot, message) => {
  bot.reply(
    message,
    "Okay, hab noch einen schönen Tag! Melde dich, wenn du Wünsche hast :)"
  );
});

controller.hears(["Danke", "Dankeschön"], "message", async (bot, message) => {
  bot.reply(
    message,
    "Immer wieder gerne! Ich bin rund um die Uhr für dich da :)"
  );
});
