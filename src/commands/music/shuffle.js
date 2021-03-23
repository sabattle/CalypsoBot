const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ShuffleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      aliases: ['shuf'],
      usage: 'shuffle',
      description: 'shuffles the queue',
      type: client.types.MUSIC
    });
  }

async run (message, args)  {
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "Join a voicechannel first")

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
    return this.sendErrorMessage(message, 0, "we are not in the same voicechannel.")
    

    if (!this.client.player.getQueue(message)) return this.sendErrorMessage(message, 0, "Queue and player were empty.")

    this.client.player.shuffle(message);

    return message.channel.send({
        embed: {
            color: '#DE8DF3',
            description: `${this.client.player.getQueue(message).tracks.length} track(s) are being shuffled`,
        },
    });
}
};