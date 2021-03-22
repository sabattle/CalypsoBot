const Discord = require('discord.js');

module.exports = (client, message, queue, track) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Track Added!')
	.setDescription(`${track.title} has been added to the queue !`)
	.setFooter('Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

};