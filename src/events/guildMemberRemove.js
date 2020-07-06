module.exports = (client, member) => {

  // Send leave message
  let leaveMessage = client.db.settings.selectLeaveMessage.pluck().get(member.guild.id);
  if (leaveMessage) leaveMessage = leaveMessage.replace('?member', member); // Member substituion
  const defaultChannelId = client.db.settings.selectDefaultChannelId.pluck().get(member.guild.id);
  let defaultChannel;
  if (defaultChannelId) defaultChannel = member.guild.channels.cache.get(defaultChannelId);
  if (leaveMessage && defaultChannel) defaultChannel.send(leaveMessage);

  client.logger.info(`${member.guild.name}: ${member.user.username} has left the server`);
  client.logger.info(`${member.guild.name}: Removing ${member.user.username} from guild_points table`);
  client.db.users.deleteRow.run(member.id, member.guild.id);
};