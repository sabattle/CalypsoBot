const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, verify } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetVerificationMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setverificationmessage',
      aliases: ['setverificationmsg', 'setvm', 'svm'],
      usage: 'setverificationmessage <message>',
      description: oneLine`
        Sets the message Calypso will post in the \`verification channel\`.
        Enter no message to clear the verification message.
        A \`verification role\`, a \`verification channel\`, 
        and a \`verification message\` must be set to enable server verification.
      `,
      type: client.types.ADMIN,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setverificationmessage Please read the server rules, then react to this message.']
    });
  }
  async run(message, args) {

    let { 
      verification_role_id: verificationRoleId,
      verification_channel_id: verificationChannelId, 
      verification_message: oldVerificationMessage,
      verification_message_id: verificationMessageId 
    } = message.client.db.settings.selectVerification.get(message.guild.id);
    const verificationRole = message.guild.roles.cache.get(verificationRoleId);
    const verificationChannel = message.guild.channels.cache.get(verificationChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(
      verificationRoleId && verificationChannelId && oldVerificationMessage
    );

    const embed = new MessageEmbed()
      .setTitle('Settings: `Verification`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`verification message\` was successfully updated. ${success}`)
      .addField('Role', verificationRole || '`None`', true)
      .addField('Channel', verificationChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      message.client.db.settings.updateVerificationMessage.run(null, message.guild.id);
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
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let verificationMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateVerificationMessage.run(verificationMessage, message.guild.id);
    if (verificationMessage.length > 1024) verificationMessage = verificationMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(verificationRole && verificationChannel && verificationMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', verificationMessage)
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
          .setDescription(verificationMessage)
          .setColor(message.guild.me.displayHexColor)
        );
        await msg.react(verify.split(':')[2].slice(0, -1));
        message.client.db.settings.updateVerificationMessageId.run(msg.id, message.guild.id);
      } else {
        return message.client.sendSystemErrorMessage(message.guild, 'verification', stripIndent`
          Unable to send verification message, please ensure I have permission to access the verification channel
        `);
      }
    }
  }
};