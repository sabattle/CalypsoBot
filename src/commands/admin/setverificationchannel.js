const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetVerificationChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationchannel',
      aliases: ['setverifchannel', 'setverifc', 'setvc', 'svc'],
      usage: 'setverificationchannel <channel mention/ID>',
      description: oneLine`
        Sets the verification text channel for your server. If set, unverified members will start here.
        Once verified, the \`verification role\` will be assigned to them.
        Please ensure that new members are not able access other server channels for proper verification.
        A \`verification channel\`, a \`verification message\`, 
        and an \`verification role\` must be set to enable server verification.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationchannel #verification']
    });
  }
  async run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const oldVerificationChannel = message.guild.channels.cache.get(verificationChannelId) || '`None`';

    // Get status
    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && verificationMessage
    );

    // Trim message
    if (verificationMessage) {
      if (verificationMessage.length >= 1018) verificationMessage = verificationMessage.slice(0, 1015) + '...';
      verificationMessage = `\`\`\`${verificationMessage}\`\`\``;
    }
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Verification`')
      .setDescription('The `verification channel` was successfully updated. <:success:736449240728993802>')
      .addField('Role', verificationRole || '`None`', true)
      .addField('Message', verificationMessage || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateVerificationChannelId.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      await oldVerificationChannel.messages.delete(verificationMessageId); // Delete old message

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(1, 0, { name: 'Channel', value: `${oldVerificationChannel} ➔ \`None\``, inline: true })
        .spliceFields(2, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    const verificationChannel = 
      this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!verificationChannel || verificationChannel.type != 'text' || !verificationChannel.viewable)
      return this.sendErrorMessage(message, `
        Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
      `);

    // Update status
    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateVerificationChannelId.run(verificationChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(1, 0, { 
        name: 'Channel', 
        value: `${oldVerificationChannel} ➔ ${verificationChannel}`, 
        inline: true
      })
      .spliceFields(2, 0, { name: 'Status', value: statusUpdate, inline: true})
    );

    // Update verification
    if (status === 'enabled') {
      if (verificationChannel.viewable) {
        await oldVerificationChannel.messages.delete(verificationMessageId);
        const msg = await verificationChannel.send(new MessageEmbed()
          .setDescription(verificationMessage.slice(3, -3))
          .setColor(message.guild.me.displayHexColor)
        );
        await msg.react('✅');
        message.client.db.settings.updateVerificationMessageId.run(msg.id, message.guild.id);
      } else {
        return;
      }
    }
  }
};
