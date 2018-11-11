const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
  name: 'user',
  usage: '<USER MENTION>',
  description: 'Fetches a user\'s information (or your own, if no user was mentioned).',
  tag: 'general',
  run: (message, args) => {
    let target =  message.mentions.members.first() || message.member;
    let embed = new Discord.RichEmbed()
      .setAuthor(target.displayName, target.user.displayAvatarURL)
      .setDescription(`Current status is **${target.presence.status}**.`)
      .setThumbnail(target.user.displayAvatarURL)
      .setFooter(`${target.user.username}#${target.user.discriminator} | User ID: ${target.id}`)
      .setTimestamp()
      .addField('Joined Atlas on', moment(target.joinedAt).format('MMM DD YYYY'), true)
      .addField('Joined Discord on', moment(target.user.createdAt).format('MMM DD YYYY'), true)
      .setColor(target.displayHexColor);
    message.channel.send(embed);
  }
}
