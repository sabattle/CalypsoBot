module.exports = async (client, message) => {
	if (message.channel.type === 'dm' || message.author.bot) return;

	// command handler
	let command;
	if (message.content.charAt(0) === client.prefix){
		const args = message.content.trim().split(/ +/g);
		command = client.commands.get(args.shift().slice(client.prefix.length).toLowerCase());
		if (command) command.run(message, args);
	}
	else {
		const reaction = client.reactions.find('prompt', message.content);
		if (reaction) reaction.run(message);
	}

	// points
	const id = message.author.id, guild = message.guild.name;
	const updatePoints = require(__basedir + '/src/utils/updatePoints.js');
	if (message.channel.id != client.devChannelID && !command) {
		if (message.content.includes('http')) updatePoints(client, id, guild, 10); // more points for link
		else if (message.attachments.size > 0) updatePoints(client, id, guild, 20); // even more points for file
		else updatePoints(client, id, guild);
	}
};
