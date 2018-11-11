module.exports = (client, member) => {
	try {
		client.channels.first.send(`Welcome to ${member.guild.name}, ${member}! Here's what you need to know:
    » '${client.prefix}' is the prefix for my commands.
    » Type \`${client.prefix}help\` to get a list of everything I can do!
    » Commands don't work in DM. Sorry :cold_sweat:
    » Have fun!`);
	}
	catch (err) {
		console.log(`Welcome message not sent\nNo text channels found in ${member.guild.name}`);
	}
};
