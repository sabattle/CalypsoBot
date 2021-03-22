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
fs.readdir('./src/player events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
      const event = require(`./player-events/${file}`);
      let eventName = file.split(".")[0];
      console.log(`Loading player event ${eventName}`);
      client.player.on(eventName, event.bind(null, client));
  });
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