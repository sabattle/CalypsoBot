const Discord = require('discord.js');
const config = require('./config.json');
const schedule = require('node-schedule');
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
	require('./src/loaders/eventLoader.js')(client);
	require('./src/loaders/commandLoader.js')(client);
	require('./src/loaders/reactionLoader.js')(client);
	client.login(client.token);
	schedule.scheduleJob('0 19 * * 5', () => { // 7:00 Friday
		require('./src/utils/updateCrown.js')(client);
	});
}

init();
