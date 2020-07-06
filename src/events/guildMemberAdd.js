const { oneLine } = require('common-tags');

module.exports = async (client, member) => {

  // Get default channel
  const defaultChannelId = client.db.settings.selectDefaultChannelId.pluck().get(member.guild.id);
  let defaultChannel;
  if (defaultChannelId) defaultChannel = member.guild.channels.cache.get(defaultChannelId);

  // Set auto role
  const autoRoleId = client.db.settings.selectAutoRoleId.pluck().get(member.guild.id);
  if (autoRoleId) {
    const autoRole = member.guild.roles.cache.get(autoRoleId);
    try {
      await member.roles.add(autoRole);
    } catch (err) {
      if (defaultChannel) return defaultChannel.send(oneLine`
        I tried to give ${autoRole} to ${member}, but something went wrong. Please check the role hierarchy and ensure 
        I have the \`Manage Roles\` permission.
      `);
    }
  }

  // Send welcome message
  let welcomeMessage = client.db.settings.selectWelcomeMessage.pluck().get(member.guild.id);
  if (welcomeMessage) welcomeMessage = welcomeMessage.replace('?member', member); // Member substituion
  if (welcomeMessage && defaultChannel) defaultChannel.send(welcomeMessage);

  // Update points db
  client.db.users.insertRow.run(member.id, member.user.username, member.guild.id, member.guild.name);

  client.logger.info(`${member.guild.name}: ${member.user.username} has joined the server`);
};