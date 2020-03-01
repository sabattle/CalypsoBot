const Command = require('../Command.js');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = class UserInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'userinfo',
      aliases: ['user', 'ui'],
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s information (or your own, if no user is mentioned).',
      type: 'general'
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    const embed = new Discord.RichEmbed()
      .setAuthor(member.displayName, member.user.displayAvatarURL)
      .setDescription(`Current status is **${member.presence.status}**.`)
      .setThumbnail(member.user.displayAvatarURL)
      .setFooter(`${member.user.username}#${member.user.discriminator} | User ID: ${member.id}`)
      .setTimestamp()
      .addField('Joined server on', moment(member.joinedAt).format('MMM DD YYYY'), true)
      .addField('Joined Discord on', moment(member.user.createdAt).format('MMM DD YYYY'), true)
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
