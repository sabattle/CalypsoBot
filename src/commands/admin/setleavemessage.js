const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setleavemessage',
      aliases: ['setlm', 'slm'],
      usage: 'setleavemessage <message>',
      description: oneLine`
        Sets the message Calypso will say when someone leaves your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        and \`?size\` to substitute for your server's current member count.
        Enter no message to clear the current \`leave message\`.
        A \`leave channel\` must also be set to enable leave messages.
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
    
    // Get status
    const oldStatus = message.client.utils.getStatus(leaveChannelId, oldLeaveMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Leave Messages`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`leave message\` was successfully updated. ${success}`)
      .addField('Channel', leaveChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateLeaveMessage.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let leaveMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateLeaveMessage.run(leaveMessage, message.guild.id);
    if (leaveMessage.length >= 1018) leaveMessage = leaveMessage.slice(0, 1015) + '...';

    // Update status
    const status =  message.client.utils.getStatus(leaveChannel, leaveMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', `\`\`\`${leaveMessage}\`\`\``)
    );
  }
};