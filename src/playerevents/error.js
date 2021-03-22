const Discord = require('discord.js');

module.exports = (client, error, message) => {
	const embedNotPlaying = new Discord.MessageEmbed()
	.setTitle('Error!')
	.setDescription(`There is no music being played on this server !`)
	.setFooter('Music System')
	.setColor('RED')
	.setTimestamp();
	const embedNotConnected = new Discord.MessageEmbed()
	.setTitle('Error!')
	.setDescription(`You are not connected in any voice channel !`)
	.setFooter('Music System')
	.setColor('RED')
	.setTimestamp();
	const embedUnableToJoin = new Discord.MessageEmbed()
	.setTitle('Error!')
	.setDescription(`I am not able to join your voice channel, please check my permissions !`)
	.setFooter('Music System')
	.setColor('RED')
	.setTimestamp();
	const embedDefault = new Discord.MessageEmbed()
	.setTitle('Error!')
	.setDescription(`Something went wrong ... Error : ${error}`)
	.setFooter('Music System')
	.setColor('RED')
	.setTimestamp();
	
    switch (error) {
        case 'NotPlaying':
            message.channel.send(embedNotPlaying);
            break;
        case 'NotConnected':
            message.channel.send(embedNotConnected);
            break;
        case 'UnableToJoin':
            message.channel.send(embedUnableToJoin);
            break;
        default:
            message.channel.send(embedDefault);
    };
};