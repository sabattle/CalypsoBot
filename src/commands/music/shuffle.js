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
    if (!message.member.voice.channel) return message.channel.send({
        embed: {
            color: '#FA1D2F',
            description: 'you must be in voice channel to use this command.'
        }
    })

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({
        embed: {
            color: '#ff0000',
            description: 'Oh-oh! we are not in a same voice channel.'
        }
    })

    if (!this.client.player.getQueue(message)) return message.channel.send({
        embed: {
            color: 'RANDOM',
            description: '**Error**! Player is Empty.'
        }
    })

    this.client.player.shuffle(message);

    return message.channel.send({
        embed: {
            color: '#DE8DF3',
            description: `${this.client.player.getQueue(message).tracks.length} track(s) are being shuffled`,
        },
    });
}
};