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
    const leaveChannelId = message.client.db.settings.selectLeaveChannelId.pluck().get(message.guild.id);
    let oldLeaveChannel = '`None`';
    if (leaveChannelId) oldLeaveChannel = message.guild.channels.cache.get(leaveChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Leave Channel', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateLeaveChannelId.run(null, message.guild.id);
      return message.channel.send(embed
        .setDescription('The `leave channel` was successfully updated.')
        .addField('Current Value', `${oldLeaveChannel} ➔ \`None\``, true)
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);
    message.client.db.settings.updateLeaveChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .setDescription(oneLine`
        The \`leave channel\` was successfully updated. Please note that a \`leave message\` must also be set.
      `)
      .addField('Current Value', `${oldLeaveChannel} ➔ ${channel}`, true)
    );
  }
};
