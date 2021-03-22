const Command = require('../Command.js');

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['vol'],
      usage: 'volume 50',
      description: 'adjusts the player volume',
      type: client.types.MUSIC
    });
  }
  
async run (message, args) {
if (!message.member.voice.channel)
return message.channel.send({
    embed: {
        color: '#FA1D2F',
        description: `**you must be in a voice channel to use this command!**`,
    },
});

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
return message.channel.send({
    embed: {
        color: '#FA1D2F',
        description: `**you must be in a voice channel to use this command!**`,
    },
});

if (!this.client.player.getQueue(message)) return message.channel.send({
embed: {
    color: '#FA1D2F',
    description: `**The __Queue__ is Empty** ;-;`
}
})

if (!args[0] || isNaN(args[0])) return message.channel.send ({
embed: {
    color: '#FA1D2F',
    description: 'Please enter a valid number.'
}
})


if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 200) return message.channel.send ({
embed: {
    color: '#FA1D2F',
    description: 'Please enter a valid number (between 1 and 200).'
}
})

message.channel.send({
embed: {
    color: '#DE8DF3',
    description: (`The volume has been changed from **${this.client.player.getQueue(message).volume}%** to **${parseInt(args[0])}%** !`),
}
})

this.client.player.setVolume(message, args[0]);
}};