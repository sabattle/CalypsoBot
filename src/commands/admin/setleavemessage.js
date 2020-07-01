const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavemessage',
      aliases: ['setlm', 'slm'],
      usage: 'setleavemessage <message>',
      description: oneLine`
        Sets the message Calypso will say when someone leaves your server.
        You may use \`?member\` to substitute for a user mention.
        Enter no message to clear the current leave message.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setleavemessage ?member has left the server.']
    });
  }
  run(message) {
    const oldLeaveMessage = message.client.db.guildSettings.selectLeaveMessage.pluck().get(message.guild.id);
    const status = (oldLeaveMessage) ? '`enabled`' : '`disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', '**Leave Message**', true)
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (!message.content.includes(' ')) {
      message.client.db.guildSettings.updateLeaveMessage.run(null, message.guild.id);
      return message.channel.send(embed
        .addField('Current Status', `${status} 🡪 \`disabled\``, true)
        .addField('New Message', '`None`')
      );
    }
    let leaveMessage = message.content.slice(message.content.indexOf(' '), message.content.length);
    message.client.db.guildSettings.updateLeaveMessage.run(leaveMessage, message.guild.id);
    if (leaveMessage.length > 1024) leaveMessage = leaveMessage.slice(1021) + '...';
    message.channel.send(embed
      .addField('Current Status', `${status} 🡪 \`enabled\``, true)
      .addField('New Message', leaveMessage)
    );
  }
};