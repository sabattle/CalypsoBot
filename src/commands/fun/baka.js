  
const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const superagent = require('superagent');

module.exports = class BakaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'baka',
      aliases: ['emoji-baka'],
      usage: 'baka',
      description: 'get a random baka image',
      type: client.types.FUN
    });
  }
async run (message, args) {

    let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    const { body } = await superagent
      .get("https://nekos.life/api/v2/img/baka");
          const embed = new MessageEmbed()
          .setColor("RANDOM")
          .setTitle(`${victim.displayName} here is your BAKA image`)
          .setImage(body.url)
           message.channel.send(embed);
      }
  }