const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetVerificationRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationrole',
      aliases: ['setverifrole', 'setverifr', 'setvr', 'svr'],
      usage: 'setverificationrole <role mention/ID>',
      description: oneLine`
        Sets the role Calypso will give members who are verified.
        Provide no role to clear the current \`verification role\`.
        A \`verification role\`, a \`verification channel\`, 
        and a \`verification message\` must be set to enable server verification.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationrole @Verified']
    });
  }
  async run(message, args) {
    let { 
      verification_role_id: verificationRoleId, 
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const oldVerificationRole = message.guild.roles.cache.get(verificationRoleId) || '`None`';
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);
    
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
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `verification role` was successfully updated. <:success:736449240728993802>')
      .addField('Channel', verificationChannel || '`None`', true)
      .addField('Message', verificationMessage || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear role
    if (args.length === 0) {
      message.client.db.settings.updateVerificationRoleId.run(null, message.guild.id);
      message.client.db.settings.updateVerificationMessageId.run(null, message.guild.id);

      if (verificationChannel && verificationMessageId) {
        try {
          await verificationChannel.messages.delete(verificationMessageId);
        } catch (err) { // Message was deleted
          message.client.logger.error(err);
        }
      }
      
      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Role', value: `${oldVerificationRole} ➔ \`None\``, inline: true })
        .spliceFields(2, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    // Update role
    const verificationRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!verificationRole)
      return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateVerificationRoleId.run(verificationRole.id, message.guild.id);

    // Update status
    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Role', value: `${oldVerificationRole} ➔ ${verificationRole}`, inline: true })
      .spliceFields(2, 0, { name: 'Status', value: statusUpdate, inline: true })
    );

    // Update verification
    if (status === 'enabled') {
      if (verificationChannel.viewable) {
        try {
          await verificationChannel.messages.fetch(verificationMessageId);
        } catch (err) { // Message was deleted
          message.client.logger.error(err);
        }
        const msg = await verificationChannel.send(new MessageEmbed()
          .setDescription(verificationMessage.slice(3, -3))
          .setColor(message.guild.me.displayHexColor)
        );
        await msg.react('✅');
        message.client.db.settings.updateVerificationMessageId.run(msg.id, message.guild.id);
      } else {
        return message.client.sendSystemErrorMessage(message.guild, 'verification', oneLine`
          Something went wrong. Unable to send the \`verification message\` to ${verificationChannel}. 
          Please ensure I have permission to access that text channel.
        `);
      }
    }
  }
};
