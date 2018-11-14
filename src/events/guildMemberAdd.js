module.exports = (client, member) => {
	try {
		const row = client.getRow.get(member.guild.id);
		client.channels.get(row.welcome).send(`Welcome to ${member.guild.name}, ${member}! Here's what you need to know:
    » '${client.prefix}' is the prefix for my commands.
    » Type \`${client.prefix}help\` to get a list of everything I can do.
    » Commands don't work in DM.
    » Have fun!`);
	}
	catch (err) {
		console.log(`Welcome message not sent\nNo text channels found in ${member.guild.name}`);
	}
};
