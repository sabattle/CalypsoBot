const Command = require('../Command.js');
const Discord = require('discord.js');
const db = require('quick.db');

module.exports = class GendCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rank',
      usage: 'rank',
      description: 'displays your rank in a small embed',
      type: client.types.LEVELS
    });
  }
  async run (message) {
    let embed = new Discord.MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(message.author.tag,message.author.avatarURL())
    .addField("Level",`${db.fetch(`level_${message.guild.id}_${message.author.id}`) || "0"}`, false)
    .addField("XP", `${db.fetch(`messages_${message.guild.id}_${message.author.id}`) || "0"}`, false)
    message.channel.send(embed)
}}