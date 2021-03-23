const Command = require('../Command.js');
const Discord = require("discord.js");
const { MessageEmbed } = require('discord.js');

module.exports = class JoinCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'join',
      aliases: ['summon'],
      usage: 'summon',
      description: 'joins a voice channel!',
      type: client.types.MUSIC
    });
  }

	async run (message) {
        if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "Join a voicechannel first.")

        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
        return this.sendErrorMessage(message, 0, "we are in different voicechannels.")

        if (message.guild.me.voice.channel && message.member.voice.channel.id === message.guild.me.voice.channel.id) 
        return this.sendErrorMessage(message, 0, "Iam already being used in a different voice channel.")

        message.member.voice.channel.join();

        message.react('👌')
}};