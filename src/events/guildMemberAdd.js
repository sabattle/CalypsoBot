const { oneLine } = require('common-tags');

module.exports = async (client, member) => {

  // Get default channel
  const welcomeChannelId = client.db.settings.selectWelcomeChannelId.pluck().get(member.guild.id);
  let welcomeChannel;
  if (welcomeChannelId) welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

  // Set auto role
  const autoRoleId = client.db.settings.selectAutoRoleId.pluck().get(member.guild.id);
  if (autoRoleId) {
    const autoRole = member.guild.roles.cache.get(autoRoleId);
    try {
      await member.roles.add(autoRole);
    } catch (err) {
      if (welcomeChannel) return client.sendSystemErrorMessage(member.guild, 'crown update', oneLine`
        Something went wrong. Unable to give ${autoRole} to ${member}. 
        Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
      `);
    }
  }

  // Send welcome message
  let welcomeMessage = client.db.settings.selectWelcomeMessage.pluck().get(member.guild.id);
  if (welcomeMessage) welcomeMessage = welcomeMessage.replace('?member', member); // Member substituion
  if (welcomeMessage && welcomeChannel) welcomeChannel.send(welcomeMessage);

  // Update points db
  client.db.users.insertRow.run(member.id, member.user.username, member.guild.id, member.guild.name);

  client.logger.info(`${member.guild.name}: ${member.user.username} has joined the server`);
};