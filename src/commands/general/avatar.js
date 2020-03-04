const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic'],
      usage: '<USER MENTION>',
      description: 'Displays a user\'s avatar (or your own, if no user is mentioned).',
      type: 'general'
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    const embed = new Discord.RichEmbed()
      .setAuthor(`${member.displayName}'s Avatar`)
      .setImage(member.user.displayAvatarURL)
      .setColor(member.displayHexColor);
    message.channel.send(embed);
  }
};
