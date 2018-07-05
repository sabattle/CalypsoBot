const Discord = require('discord.js');
const config = require('./config.json');

//setup
const client = new Discord.Client();
client.token = config.token;
client.prefix = config.prefix;
client.ownerID = config.ownerID;
client.defaultChannelID = config.defaultChannelID;
client.color = config.color;
client.commands = new Discord.Collection();
client.reactions = new Discord.Collection();

//initialize client
function init() {
  require('./src/event_loader.js')(client);
  require('./src/command_loader.js')(client);
  require('./src/reaction_loader.js')(client);
  client.login(client.token);
}

init();
