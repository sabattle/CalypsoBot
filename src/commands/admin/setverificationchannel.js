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
  run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const oldVerificationChannel = message.guild.channels.cache.get(verificationChannelId) || '`None`';
    let status, oldStatus = (verificationRoleId && verificationChannelId && verificationMessage) 
      ? '`enabled`' : '`disabled`';

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

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';
      
      return message.channel.send(embed
        .spliceFields(1, 0, { name: 'Channel', value: `${oldVerificationChannel} ➔ \`None\``, inline: true })
        .spliceFields(2, 0, { name: 'Status', value: status, inline: true })
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);

    // Check status
    if (oldStatus != '`enabled`' && verificationRole && channel && verificationMessage) 
      status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.client.db.settings.updateVerificationChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(1, 0, { name: 'Channel', value: `${oldVerificationChannel} ➔ ${channel}`, inline: true})
      .spliceFields(2, 0, { name: 'Status', value: status, inline: true})
    );

    // Verif stuff
  }
};
