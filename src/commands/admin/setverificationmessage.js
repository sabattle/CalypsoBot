const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetVerificationMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationmessage',
      aliases: ['setverifmessage', 'setverifm', 'setvm', 'svm'],
      usage: 'setverificationmessage <message>',
      description: oneLine`
        Sets the message Calypso will post in the \`verification channel\`.
        Enter no message to clear the verification message.
        A \`verification role\`, a \`verification channel\`, 
        and a \`verification message\` must be set to enable server verification.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationmessage Please read the server rules, then react to this message.']
    });
  }
  run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: oldVerificationMessage 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);
    let status, oldStatus = (verificationRoleId && verificationChannelId && oldVerificationMessage) 
      ? '`enabled`' : '`disabled`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Verification`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `verification message` was successfully updated. <:success:736449240728993802>')
      .addField('Role', verificationRole || '`None`', true)
      .addField('Channel', verificationChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateVerificationMessage.run(null, message.guild.id);

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';

      return message.channel.send(embed
        .addField('Status', status, true)
        .addField('Message', '`None`')
      );
    }
    
    let verificationMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateVerificationMessage.run(verificationMessage, message.guild.id);
    if (verificationMessage.length >= 1018) verificationMessage = verificationMessage.slice(0, 1015) + '...';

    // Check status
    if (oldStatus != '`enabled`' && verificationRole && verificationChannel && verificationMessage) 
      status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.channel.send(embed
      .addField('Status', status, true)
      .addField('Message', `\`\`\`${verificationMessage}\`\`\``)
    );

    // Verif stuff
  }
};