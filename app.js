const fs = require('fs');
const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents, Collection } = require('discord.js');
const {Player} = require('discord-player'); //music using discord-player module
const moment = require("moment");

moment.relativeTimeThreshold("s", 60);
moment.relativeTimeThreshold("ss", 5);
moment.relativeTimeThreshold("m", 60);
moment.relativeTimeThreshold("h", 60);
moment.relativeTimeThreshold("d", 24);
moment.relativeTimeThreshold("M", 1);

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
.filter((file) => file.endsWith(".js"));
for (const file of musicevents) {
const event = require(`./src/playerevents/${file}`);
let eventName = file.split(".")[0];
client.player.on(eventName, event.bind(null, client));
}

//load giveaways 
const { GiveawaysManager } = require('discord-giveaways'); //for giveaways module
client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./src/utils/giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        embedColor: "RANDOM",
        reaction: "🎉"
    }
});

// We now have a client.giveawaysManager property to manage our giveaways!
client.giveawaysManager.on("giveawayReactionAdded", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} entered giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayReactionRemoved", (giveaway, member, reaction) => {
    console.log(`${member.user.tag} unreact to giveaway #${giveaway.messageID} (${reaction.emoji.name})`);
});

client.giveawaysManager.on("giveawayEnded", (giveaway, winners) => {
    console.log(`Giveaway #${giveaway.messageID} ended! Winners: ${winners.map((member) => member.user.username).join(', ')}`);
});


// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  client.loadTopics('./data/trivia');
  client.snipes = new Collection()
  client.login(client.token);
}

init();

process.on('unhandledRejection', err => client.logger.error(err));