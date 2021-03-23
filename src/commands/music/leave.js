const Command = require('../Command.js');
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');

module.exports = class LeaveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leave',
      aliases: ['dc','disconnect'],
      usage: 'leave',
      description: 'leave\'s a voice channel!',
      type: client.types.MUSIC
    });
  }

	async run (message) {
if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "join a voicechannel first.")

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
return this.sendErrorMessage(message, 0, "we are in different voicechannels.")

     message.guild.voice.channel.leave()

message.react('👋')
  }}