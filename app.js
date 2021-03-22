const fs = require('fs');
const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents, Collection } = require('discord.js');
const {Player} = require('discord-player') //music using discord-player module

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