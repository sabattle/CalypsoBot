const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class HowgayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howgay',
      aliases: ['hwgay'],
      usage: 'howgay @user',
      description: 'Send\'s how gay you were',
      type: client.types.FUN
    });
  }

run(msg, args) {
    let user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member
    return msg.channel.send(`**${Math.floor(Math.random() * 100) + 1}%** gay`);
}}