const Discord = require('discord.js');
const config = require('./config.json');
global.__basedir = __dirname;

// setup
const client = new Discord.Client();
client.token = config.token;
client.prefix = config.prefix;
client.ownerID = config.ownerID;
client.devChannelID = config.devChannelID; // dev channel id
client.color = config.color;
client.commands = new Discord.Collection();
client.reactions = new Discord.Collection();

// initialize client
function init() {
	require('./src/eventLoader.js')(client);
	require('./src/commandLoader.js')(client);
	require('./src/reactionLoader.js')(client);
	client.login(client.token);
}

init();
