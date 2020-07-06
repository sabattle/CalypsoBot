const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ShowWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showwelcomemessage',
      aliases: ['showwm', 'shwm'],
      usage: 'showwelcomemessage',
      description: 'Shows the current welcome message and welcome message status for your server.',
      type: 'admin'
    });
  }
  run(message) {
    let welcomeMessage = message.client.db.settings.selectWelcomeMessage.pluck().get(message.guild.id);
    const status = (welcomeMessage) ? '`true`' : '`false`';
    if (!welcomeMessage) welcomeMessage = '`None`';
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Welcome Message')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', '**Welcome Message**', true)
      .addField('Current Status', status, true)
      .addField('Current Message', welcomeMessage)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};