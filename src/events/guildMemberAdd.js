module.exports = async (client, member) => {
	try {
		const config = client.getConfig.get(member.guild.id);
		if (config.autoRole != 'none'){
			const autoRole = member.guild.roles.find(r => r.name === config.autoRole);
			try {
				await member.addRole(autoRole);
			}
			catch (err) {
				console.log(err.message);
			}
		}
		if (config.defaultChannelID === 'none') return;
		client.channels.get(config.defaultChannelID).send(`Welcome to ${member.guild.name}, ${member}! Here's what you need to know:
    » '${client.prefix}' is the prefix for my commands.
    » Type \`${client.prefix}help\` to get a list of everything I can do.
    » Commands don't work in DM.
    » Have fun!`);
	}
	catch (err) {
		return;
	}
};
