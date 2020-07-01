const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class ThouArtCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'thouart',
      aliases: ['elizabethan', 'ta'],
      usage: 'thouart [user mention]',
      description: 'Says a random Elizabethan insult to the mentioned user (or you, if no user is mentioned).',
      type: 'fun',
      examples: ['thouart @Calypso']
    });
  }
  async run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    try {
      const res = await fetch('http://quandyfactory.com/insult/json/');
      let insult = (await res.json()).insult;
      insult = insult.charAt(0).toLowerCase() + insult.slice(1);
      const embed = new MessageEmbed()
        .setTitle('🎭  Thou Art  🎭')
        .setDescription(`${member}, ${insult}`)
        .setFooter(`Requested by ${message.member.displayName}#${message.author.discriminator}`, 
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Something went wrong. Please try again in a few seconds.', err.message);
    }
  }
};
