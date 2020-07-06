const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ShowLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showleavemessage',
      aliases: ['showlm', 'shlm'],
      usage: 'showleavemessage',
      description: 'Shows the current leave message and leave message status for your server.',
      type: 'admin'
    });
  }
  run(message) {
    let leaveMessage = message.client.db.settings.selectLeaveMessage.pluck().get(message.guild.id);
    const status = (leaveMessage) ? '`true`' : '`false`';
    if (!leaveMessage) leaveMessage = '`None`';
    if (leaveMessage.length > 1024) leaveMessage = leaveMessage.slice(1021) + '...';
    const embed = new MessageEmbed()
      .setTitle('Leave Message')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', '**Leave Message**', true)
      .addField('Current Status', status, true)
      .addField('Current Message', leaveMessage)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};