module.exports = (client, member) => {

  // Send leave message
  let leaveMessage = client.db.settings.selectLeaveMessage.pluck().get(member.guild.id);
  if (leaveMessage) leaveMessage = leaveMessage.replace('?member', member); // Member substituion
  const leaveChannelId = client.db.settings.selectLeaveChannelId.pluck().get(member.guild.id);
  let leaveChannel;
  if (leaveChannelId) leaveChannel = member.guild.channels.cache.get(leaveChannelId);
  if (leaveMessage && leaveChannel) leaveChannel.send(leaveMessage);

  client.logger.info(`${member.guild.name}: ${member.user.username} has left the server`);
};