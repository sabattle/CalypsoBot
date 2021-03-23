const Command = require('../Command.js');
const Discord = require('discord.js')

module.exports = class StopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: [],
      usage: 'stop',
      description: 'stops and clears the queue',
      type: client.types.MUSIC
    });
  }
  
  async run (message, client, args) {
    const queue = this.client.player.getQueue(message);

    if (!message.member.voice.channel) return this.sendErrorMessage(message,0, 'Join a voice channel first!');

    if (!queue) return this.sendErrorMessage(message, 0, "Player and Queue were empty");
    this.client.player.stop(message);


    const embed = new Discord.MessageEmbed()
	    .setTitle('Stopped !')
	    .setDescription(` Music **stopped** into this server !`)
      .setFooter('Music System')
      .setColor('RANDOM')
    	.setTimestamp();
    message.channel.send(embed);
    }
};