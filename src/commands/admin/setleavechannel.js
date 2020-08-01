const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetLeaveChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavechannel',
      aliases: ['setlc', 'slc'],
      usage: 'setleavechannel <channel mention/ID>',
      description: oneLine`
        Sets the leave message text channel for your server. 
        Provide no channel to clear the current leave channel.
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
    let status, oldStatus = (leaveChannelId && leaveMessage) ? '`enabled`' : '`disabled`';

    // Trim message
    if (leaveMessage.length >= 1018) leaveMessage = leaveMessage.slice(0, 1015) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Leave Messages`')
      .setDescription('The `leave channel` was successfully updated. <:success:736449240728993802>')
      .addField('Message', `\`\`\`${leaveMessage}\`\`\`` || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateLeaveChannelId.run(null, message.guild.id);

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Channel', value: `${oldLeaveChannel} ➔ \`None\``, inline: true })
        .spliceFields(1, 0, { name: 'Status', value: status, inline: true })
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);

    // Check status
    if (oldStatus != '`enabled`' && channel && leaveMessage) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.client.db.settings.updateLeaveChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Channel', value: `${oldLeaveChannel} ➔ ${channel}`, inline: true})
      .spliceFields(1, 0, { name: 'Status', value: status, inline: true})
    );
  }
};
