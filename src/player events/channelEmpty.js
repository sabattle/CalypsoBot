const Discord = require('discord.js');

module.exports = (client, message, queue) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Channel Empty!')
	.setDescription(`Music stopped as there is no more member in the voice channel !`)
	.setFooter('Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

};