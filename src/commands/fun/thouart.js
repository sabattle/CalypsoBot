const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const { oneLine } = require('common-tags');

module.exports = class ThouArtCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'thouart',
      aliases: ['elizabethan', 'ta'],
      usage: 'thouart [user mention/ID]',
      description: oneLine`
        Says a random Elizabethan insult to the specified user. 
        If no user is given, then the insult will be directed at you!
      `,
      type: client.types.FUN,
      examples: ['thouart @Nettles']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || 
      message.guild.members.cache.get(args[0]) || 
      message.member;
    try {
      const res = await fetch('http://quandyfactory.com/insult/json/');
      let insult = (await res.json()).insult;
      insult = insult.charAt(0).toLowerCase() + insult.slice(1);
      const embed = new MessageEmbed()
        .setTitle('🎭  Thou Art  🎭')
        .setDescription(`${member}, ${insult}`)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};
