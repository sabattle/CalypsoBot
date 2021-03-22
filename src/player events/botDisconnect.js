const Discord = require('discord.js');

module.exports = (client, message, queue) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Karma Disconnected!')
	.setDescription(`${client.emotes.error} - Music stopped as i have been disconnected from the channel !`)
	.setFooter('Karma Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

};