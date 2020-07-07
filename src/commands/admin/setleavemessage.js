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
  run(message, args) {
    const oldLeaveMessage = message.client.db.settings.selectLeaveMessage.pluck().get(message.guild.id);
    const status = (oldLeaveMessage) ? '`enabled`' : '`disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Leave Message', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    
    if (!args[0]) {
      message.client.db.settings.updateLeaveMessage.run(null, message.guild.id);
      return message.channel.send(embed
        .setDescription('The `leave message` was successfully updated.')
        .addField('Current Status', `${status} ➔ \`disabled\``, true)
        .addField('New Message', '`None`')
      );
    }
    
    let leaveMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateLeaveMessage.run(leaveMessage, message.guild.id);
    if (leaveMessage.length > 1024) leaveMessage = leaveMessage.slice(1021) + '...';
    message.channel.send(embed
      .setDescription(oneLine`
        The \`leave message\` was successfully updated. Please note that a \`leave channel\` must also be set.
      `)
      .addField('Current Status', `${status} ➔ \`enabled\``, true)
      .addField('New Message', leaveMessage)
    );
  }
};