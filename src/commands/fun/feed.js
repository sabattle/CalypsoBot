const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class BakaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'feed',
      aliases: ['emoji-feed'],
      usage: 'feed @user',
      description: 'hug someone',
      type: client.types.FUN
    });
  }
async run (message, args) {
  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/feed");
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${message.author.username} feeds ${victim.displayName}`)
        .setImage(body.url)
         message.channel.send(embed);
      }
  }