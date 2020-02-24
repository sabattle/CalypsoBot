const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      usage: '<USER MENTION>',
      description: 'Displays a user\'s avatar (or your own, if no user is mentioned).',
      type: 'general'
    });
  }
  run(message) {
    const target =  message.mentions.members.first() || message.member;
    const embed = new Discord.RichEmbed()
      .setAuthor(`${target.displayName}'s Avatar`)
      .setImage(target.user.displayAvatarURL)
      .setColor(target.displayHexColor);
    message.channel.send(embed);
  }
};
