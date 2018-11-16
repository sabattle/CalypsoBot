const updatePoints = require(__basedir + '/src/utils/updatePoints.js');

module.exports = (client, message) => {
	if (message.channel.type === 'dm' || message.author.bot) return;

	// command handler
	let command;
	if (message.content.charAt(0) === client.prefix){
		const args = message.content.trim().split(/ +/g);
		command = client.commands.get(args.shift().slice(client.prefix.length).toLowerCase());
		if (command) command.run(message, args);
	}
	else {
		const reaction = client.reactions.find(r => r.prompt === message.content);
		if (reaction) reaction.run(message);
	}

	// points
	const id = message.author.id, guild = message.guild.name;
	if (!command) {
		if (message.content.includes('http') || message.attachments.size > 0) updatePoints(client, id, guild, 15); // link or file
		else updatePoints(client, id, guild);
	}
};
