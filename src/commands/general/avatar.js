const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic'],
      usage: 'avatar [user mention]',
      description: 'Displays a user\'s avatar (or your own, if no user is mentioned).',
      type: 'general',
      examples: ['avatar @Calypso']
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    const embed = new Discord.MessageEmbed()
      .setTitle(`${member.displayName}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ size: 512 }))
      .setFooter(`Requested by ${message.member.displayName}#${message.author.discriminator}`, 
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
