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
    let welcomeMessage = message.client.db.guildSettings.selectWelcomeMessage.pluck().get(message.guild.id);
    const status = (welcomeMessage) ? '`true`' : '`false`';
    if (!welcomeMessage) welcomeMessage = '`None`';
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Welcome Message')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', '**Welcome Message**', true)
      .addField('Current Status', status, true)
      .addField('Current Message', welcomeMessage)
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};