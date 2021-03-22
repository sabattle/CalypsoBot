const Discord = require('discord.js');

module.exports = (message, track) => {
	const embed = new Discord.MessageEmbed()
	.setTitle('Track Started!')
	.setDescription(` Now playing ${track.title} into ${message.member.voice.channel.name} ...`)
	.setFooter('Music System')
	.setColor('RANDOM')
	.setTimestamp();
    message.channel.send(embed);

}