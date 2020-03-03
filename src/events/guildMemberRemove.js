module.exports = (client, member) => {

  // Send leave message
  let leaveMessage = client.db.guildSettings.selectLeaveMessage.pluck().get(member.guild.id);
  if (leaveMessage) leaveMessage = leaveMessage.replace('?member', member); // Member substituion
  const defaultChannelId = client.db.guildSettings.selectDefaultChannelId.pluck().get(member.guild.id);
  let defaultChannel;
  if (defaultChannelId) defaultChannel = member.guild.channels.get(defaultChannelId);
  if (leaveMessage && defaultChannel) defaultChannel.send(leaveMessage);

  client.logger.info(`${member.user.username} has left ${member.guild.name}`);
};