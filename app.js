const fs = require('fs');
const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents, Collection } = require('discord.js');
const {Player} = require('discord-player'); //music using discord-player module
const { GiveawaysManager } = require('discord-giveaways'); //for giveaways module
const moment = require('moment'); 
const db = require('quick.db');

moment.relativeTimeThreshold('s', 60);
moment.relativeTimeThreshold('ss', 5);
moment.relativeTimeThreshold('m', 60);
moment.relativeTimeThreshold('h', 60);
moment.relativeTimeThreshold('d', 24);
moment.relativeTimeThreshold('M', 1);

global.__basedir = __dirname;

// Client setup
const intents = new Intents();
intents.add(
  'GUILD_PRESENCES',
  'GUILD_MEMBERS',
  'GUILDS',
  'GUILD_VOICE_STATES',
  'GUILD_MESSAGES',
  'GUILD_MESSAGE_REACTIONS'
);
const client = new Client(config, { ws: { intents: intents } });

//discord-player stuff here
const player = new Player(client);
client.player = player;

//player events
const musicevents = fs
  .readdirSync('./src/playerevents/')
  .filter((file) => file.endsWith('.js'));
for (const file of musicevents) {
  const event = require(`./src/playerevents/${file}`);
  let eventName = file.split('.')[0];
  client.player.on(eventName, event.bind(null, client));
}

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {

  // This function is called when the manager needs to get all the giveaway stored in the database.
  async getAllGiveaways(){
      // Get all the giveaway in the database
      return db.get("giveaways");
  }

  // This function is called when a giveaway needs to be saved in the database (when a giveaway is created or when a giveaway is edited).
  async saveGiveaway(messageID, giveawayData){
      // Add the new one
      db.push("giveaways", giveawayData);
      // Don't forget to return something!
      return true;
  }

  async editGiveaway(messageID, giveawayData){
      // Gets all the current giveaways
      const giveaways = db.get("giveaways");
      // Remove the old giveaway from the current giveaways ID
      const newGiveawaysArray = giveaways.filter((giveaway) => giveaway.messageID !== messageID);
      // Push the new giveaway to the array
      newGiveawaysArray.push(giveawayData);
      // Save the updated array
      db.set("giveaways", newGiveawaysArray);
      // Don't forget to return something!
      return true;
  }

  // This function is called when a giveaway needs to be deleted from the database.
  async deleteGiveaway(messageID){
      // Remove the giveaway from the array
      const newGiveawaysArray = db.get("giveaways").filter((giveaway) => giveaway.messageID !== messageID);
      // Save the updated array
      db.set("giveaways", newGiveawaysArray);
      // Don't forget to return something!
      return true;
  }

};
if(!db.get("giveaways")) db.set("giveaways", []);
// Create a new instance of your new class
const manager = new GiveawayManagerWithOwnDatabase(client, {
  storage: false,
  updateCountdownEvery: 5000,
  default: {
      botsCanWin: false,
      embedColor: "RANDOM",
      reaction: "🎉"
  }
});
client.giveawaysManager = manager;
// We now have a client.giveawaysManager property to manage our giveaways!

client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
  console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});


// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.loadTopics('./data/trivia');
  client.snipes = new Collection();
  client.login(client.token);
}

init();

process.on('unhandledRejection', err => client.logger.error(err));