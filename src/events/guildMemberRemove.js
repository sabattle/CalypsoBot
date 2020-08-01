module.exports = (client, member) => {

  // Send leave message
  let { leave_channel_id: leaveChannelId, leave_message_id: leaveMessage } = 
    client.db.settings.selectLeaveMessages.get(member.guild.id);
  if (leaveMessage) leaveMessage = leaveMessage.replace('?member', member); // Member substituion
  const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
  if (leaveMessage && leaveChannel && leaveChannel.viewable) leaveChannel.send(leaveMessage);

  // Update users table
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

  client.logger.info(`${member.guild.name}: ${member.user.tag} has left the server`);
};