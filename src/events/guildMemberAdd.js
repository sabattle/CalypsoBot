module.exports = async (client, member) => {
	try {
		const row = client.getRow.get(member.guild.id);
		if (row.autoRole != 'none'){
			const autoRole = member.guild.roles.find(r => r.name === row.autoRole);
			try {
				await member.addRole(autoRole);
			}
			catch (err) {
				console.log(err.message);
			}
		}
		if (row.defaultChannelID === 'none') return;
		client.channels.get(row.defaultChannelID).send(`Welcome to ${member.guild.name}, ${member}! Here's what you need to know:
    » '${client.prefix}' is the prefix for my commands.
    » Type \`${client.prefix}help\` to get a list of everything I can do.
    » Commands don't work in DM.
    » Have fun!`);
	}
	catch (err) {
		return;
	}
};
