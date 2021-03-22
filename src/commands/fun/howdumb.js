const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class HowdumbCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howdumb',
      aliases: ['hdb'],
      usage: 'howdumb @user',
      description: 'Send\'s how dumb you were',
      type: client.types.FUN
    });
  }

run(msg, args) {
    let user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member
    return msg.channel.send(`**${user.displayName}** is __${Math.floor(Math.random() * 100) + 1}%__ dumb`);
}}