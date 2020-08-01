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
  run(message, args) {
    let { 
      verification_role_id: verificationRoleId, 
      verification_channel_id: verificationChannelId, 
      verification_message: verificationMessage, 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const oldRole = message.guild.roles.cache.get(verificationRoleId) || '`None`';
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);
    let status, oldStatus = (verificationRoleId && verificationChannelId && verificationMessage) 
      ? '`enabled`' : '`disabled`';

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
      
      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';

      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Role', value: `${oldRole} ➔ \`None\``, inline: true })
        .spliceFields(2, 0, { name: 'Status', value: status, inline: true })
      );
    }

    // Update role
    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateVerificationRoleId.run(role.id, message.guild.id);

    // Check status
    if (oldStatus != '`enabled`' && role && verificationChannel && verificationMessage) 
      status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Role', value: `${oldRole} ➔ ${role}`, inline: true })
      .spliceFields(2, 0, { name: 'Status', value: status, inline: true })
    );

    // Verif stuff
  }
};
