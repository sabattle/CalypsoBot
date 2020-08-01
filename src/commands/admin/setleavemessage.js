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
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setleavemessage ?member has left the server.']
    });
  }
  run(message, args) {

    const { leave_channel_id: leaveChannelId, leave_message: oldLeaveMessage } = 
      message.client.db.settings.selectLeaveMessages.get(message.guild.id);
    const leaveChannel = message.guild.channels.cache.get(leaveChannelId);
    let status, oldStatus = (leaveChannelId && oldLeaveMessage) ? '`enabled`' : '`disabled`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Leave Messages`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `leave message` was successfully updated. <:success:736449240728993802>')
      .addField('Channel', leaveChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateLeaveMessage.run(null, message.guild.id);

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';

      return message.channel.send(embed
        .addField('Status', status, true)
        .addField('Message', '`None`')
      );
    }
    
    let leaveMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateLeaveMessage.run(leaveMessage, message.guild.id);
    if (leaveMessage.length >= 1018) leaveMessage = leaveMessage.slice(0, 1015) + '...';

    // Check status
    if (oldStatus != '`enabled`' && leaveChannel && leaveMessage) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.channel.send(embed
      .addField('Status', status, true)
      .addField('Message', `\`\`\`${leaveMessage}\`\`\``)
    );
  }
};