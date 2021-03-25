const Command = require('../Command.js');
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearqueue',
      aliases: ['cq'],
      usage: 'clearqueue',
      description: 'clears the current queue',
      type: client.types.MUSIC
    });
  }
  async run (message) {
if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "Join a voicechannel first")

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
return this.sendErrorMessage(message, 0, "we are not in same channel")


if (!this.client.player.getQueue(message)) return this.sendErrorMessage(message, 0, "Queue is empty, nothing to clear")

this.client.player.clearQueue(message);

const embed = new MessageEmbed()
.setDescription('The current queue is cleared, use play <song> to add more!')
.setColor('RANDOM')
message.channel.send(embed)

}
};