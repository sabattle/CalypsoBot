const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class BakaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tickle',
      aliases: ['emoji-tickle'],
      usage: 'tickle @user',
      description: 'tickle someone',
      type: client.types.FUN
    });
  }
async run (message, args) {
    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const { body } = await superagent
    .get("https://nekos.life/api/v2/img/tickle");
        const embed = new MessageEmbed()
        .setColor("RANDOM")
        .setTitle(`${message.author.username} tickles ${victim.displayName}`)
        .setImage(body.url)
         message.channel.send(embed);
      }
  }