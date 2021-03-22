const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class BakaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'cuddle',
      aliases: ['emoji-cuddle'],
      usage: 'cuddle @user',
      description: 'hug someone',
      type: client.types.FUN
    });
  }
async run (message, args) {
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/cuddle");
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${message.author.username} cuddles ${victim.displayName}`)
        .setImage(body.url)
         message.channel.send(embed);
      }
  }