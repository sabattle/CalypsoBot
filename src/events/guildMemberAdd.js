module.exports = async (client, member) => {

  // Set auto role
  const autoRoleId = client.db.guildSettings.selectAutoRoleId.pluck().get(member.guild.id);
  if (autoRoleId) {
    const autoRole = member.guild.roles.get(autoRoleId);
    await member.addRole(autoRole);
  }

  // Send welcome message
  const enabled = client.db.guildSettings.selectUseWelcomeMessage.pluck().get(member.guild.id);
  let welcomeMessage = client.db.guildSettings.selectWelcomeMessage.pluck().get(member.guild.id);
  if (welcomeMessage) welcomeMessage = welcomeMessage.replace('?member', member); // Member substituion
  const defaultChannelId = client.db.guildSettings.selectDefaultChannelId.pluck().get(member.guild.id);
  let defaultChannel;
  if (defaultChannelId) defaultChannel = member.guild.channels.get(defaultChannelId);
  if (enabled && welcomeMessage && defaultChannel) defaultChannel.send(welcomeMessage);

  // Update points db
  client.db.guildPoints.insertRow.run(member.id, member.user.username, member.guild.id, member.guild.name);

  client.logger.info(`${member.user.username} has joined ${member.guild.name}`);
};