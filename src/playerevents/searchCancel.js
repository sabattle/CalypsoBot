const Discord = require('discord.js');

module.exports = (client, message, query, tracks) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Search Cancelled!')
	.setDescription(`You did not provide a valid response ... Please send the command again !`)
	.setFooter('Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

};