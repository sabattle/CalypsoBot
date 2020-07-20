module.exports = (client, member) => {

  // Send leave message
  let leaveMessage = client.db.settings.selectLeaveMessage.pluck().get(member.guild.id);
  if (leaveMessage) leaveMessage = leaveMessage.replace('?member', member); // Member substituion
  const leaveChannelId = client.db.settings.selectLeaveChannelId.pluck().get(member.guild.id);
  let leaveChannel;
  if (leaveChannelId) leaveChannel = member.guild.channels.cache.get(leaveChannelId);
  if (leaveMessage && leaveChannel) leaveChannel.send(leaveMessage);

  // Update users table
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

  client.logger.info(`${member.guild.name}: ${member.user.tag} has left the server`);
};