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
return this.sendErrorMessage(message,0, 'Join a voice channel first!')

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id)
return this.sendErrorMessage(message,0, 'we are not in same voicechannel')

if (!this.client.player.getQueue(message)) return this.sendErrorMessage(message,0, 'Queue and player were empty')

if (!args[0] || isNaN(args[0])) return this.sendErrorMessage(message,0, 'volume must be a number between 1-200')


if (Math.round(parseInt(args[0])) < 1 || Math.round(parseInt(args[0])) > 200) return this.sendErrorMessage(message,0, 'Enter a valid number, 1-200')

message.channel.send({
embed: {
    color: '#DE8DF3',
    description: (`The volume has been changed from **${this.client.player.getQueue(message).volume}%** to **${parseInt(args[0])}%** !`),
}
})

this.client.player.setVolume(message, args[0]);
}};