const { oneLine } = require('common-tags');

module.exports = async (client, messageReaction, user) => {

  if (messageReaction.emoji.name != '✅' || client.user === user) return;

  const { verification_role_id: verificationRoleId, verification_message_id: verificationMessageId } = 
    client.db.settings.selectVerification.get(messageReaction.message.guild.id);
  const verificationRole = messageReaction.message.guild.roles.cache.get(verificationRoleId);

  if (!verificationRole || messageReaction.message.id != verificationMessageId) return;

  const member = messageReaction.message.guild.members.cache.get(user.id);
  if (!member.roles.cache.has(verificationRole)) {
    try {
      await member.roles.add(verificationRole);
    } catch (err) {
      return client.sendSystemErrorMessage(member.guild, 'verification', oneLine`
      Something went wrong. Unable to give ${verificationRole} to ${member}. 
      Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
    `, err.message);
    }
  }
};