const Discord = require('discord.js');
const config = require('./config.json');
const sqlite = require('sqlite');
sqlite.open(`./data/db.sqlite`);

//setup
const client = new Discord.Client();
client.token = config.token;
client.prefix = config.prefix;
client.ownerID = config.ownerID;
client.defaultChannelID = config.defaultChannelID;
client.devChannelID = config.devChannelID; // dev channel id
client.color = config.color;
client.commands = new Discord.Collection();
client.reactions = new Discord.Collection();

//initialize client
function init() {
  require('./src/eventLoader.js')(client);
  require('./src/commandLoader.js')(client);
  require('./src/reactionLoader.js')(client);
  client.login(client.token);
}

init();
