const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ShowCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showcrownmessage',
      aliases: ['showcm', 'shcm'],
      usage: 'showcrownmessage',
      description: 'Shows the current crown message and crown message status for your server.',
      type: 'admin'
    });
  }
  run(message) {
    let crownMessage = message.client.db.settings.selectCrownMessage.pluck().get(message.guild.id);
    const status = (crownMessage) ? '`true`' : '`false`';
    if (!crownMessage) crownMessage = '`None`';
    if (crownMessage.length > 1024) crownMessage = crownMessage.slice(1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Crown Message')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', '**Crown Message**', true)
      .addField('Current Status', status, true)
      .addField('Current Message', crownMessage)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  } 
};