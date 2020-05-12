const { oneLine } = require('common-tags');

module.exports = async (client, member) => {

  // Get default channel
  const defaultChannelId = client.db.guildSettings.selectDefaultChannelId.pluck().get(member.guild.id);
  let defaultChannel;
  if (defaultChannelId) defaultChannel = member.guild.channels.get(defaultChannelId);

  // Set auto role
  const autoRoleId = client.db.guildSettings.selectAutoRoleId.pluck().get(member.guild.id);
  if (autoRoleId) {
    const autoRole = member.guild.roles.get(autoRoleId);
    try {
      await member.addRole(autoRole);
    } catch (err) {
      if (defaultChannel) return defaultChannel.send(oneLine`
        I tried to give ${autoRole} to ${member}, but something went wrong. Please check the role hierarchy and ensure 
        I have the \`Manage Roles\` permission.
      `);
    }
  }

  // Send welcome message
  let welcomeMessage = client.db.guildSettings.selectWelcomeMessage.pluck().get(member.guild.id);
  if (welcomeMessage) welcomeMessage = welcomeMessage.replace('?member', member); // Member substituion
  if (welcomeMessage && defaultChannel) defaultChannel.send(welcomeMessage);

  // Update points db
  client.db.guildPoints.insertRow.run(member.id, member.user.username, member.guild.id, member.guild.name);

  client.logger.info(`${member.guild.name}: ${member.user.username} has joined the server`);
};