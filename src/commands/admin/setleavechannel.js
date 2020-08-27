const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetLeaveChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavechannel',
      aliases: ['setlc', 'slc'],
      usage: 'setleavechannel <channel mention/ID>',
      description: oneLine`
        Sets the leave message text channel for your server. 
        Provide no channel to clear the current \`leave channel\`.
        A \`leave message\` must also be set to enable leave messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setleavechannel #general']
    });
  }
  run(message, args) {
    let { leave_channel_id: leaveChannelId, leave_message: leaveMessage } = 
      message.client.db.settings.selectLeaveMessages.get(message.guild.id);
    const oldLeaveChannel = message.guild.channels.cache.get(leaveChannelId) || '`None`';

    // Get status
    const oldStatus = message.client.utils.getStatus(leaveChannelId, leaveMessage);

    // Trim message
    if (leaveMessage && leaveMessage.length > 1024) leaveMessage = leaveMessage.slice(0, 1021) + '...';
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Leave Messages`')
      .setDescription(`The \`leave channel\` was successfully updated. ${success}`)
      .addField('Message', message.client.utils.replaceKeywords(leaveMessage) || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateLeaveChannelId.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Channel', value: `${oldLeaveChannel} ➔ \`None\``, inline: true })
        .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    const leaveChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!leaveChannel || (leaveChannel.type != 'text' && leaveChannel.type != 'news') || !leaveChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);

    // Update status
    const status =  message.client.utils.getStatus(leaveChannel, leaveMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateLeaveChannelId.run(leaveChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Channel', value: `${oldLeaveChannel} ➔ ${leaveChannel}`, inline: true})
      .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true})
    );
  }
};
