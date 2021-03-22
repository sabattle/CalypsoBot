const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
module.exports = class RateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rate',
      aliases: ['rt'],
      usage: 'rate @user',
      description: 'Rate\'s user\'s length',
      type: client.types.FUN
    });
  }

run(msg, args) {
  let rts = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member
    return msg.channel.send(`<:eyeshmm:812007061041971240> Hmm I would rate **<@${rts.id}>** a **${Math.floor(Math.random() * 10) + 1}/10**`);
}}