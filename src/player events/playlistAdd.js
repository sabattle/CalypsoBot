const Discord = require('discord.js');

module.exports = (client, message, playlist) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Playlist Add!')
	.setDescription(`${playlist.title} has been added to the queue (**${playlist.items.length}** songs) !`)
	.setFooter('Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

};