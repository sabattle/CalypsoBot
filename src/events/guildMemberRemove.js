const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {

  if (member.user === client.user) return;

  client.logger.info(`${member.guild.name}: ${member.user.tag} has left the server`);

  /** ------------------------------------------------------------------------------------------------
   * LEAVE MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  // Send leave message
  let { leave_channel_id: leaveChannelId, leave_message: leaveMessage } = 
    client.db.settings.selectLeaveMessages.get(member.guild.id);
  const leaveChannel = member.guild.channels.cache.get(leaveChannelId);
  
  if (
    leaveChannel &&
    leaveChannel.viewable &&
    leaveChannel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    leaveMessage
  ) {
    leaveMessage = leaveMessage
      .replace(/`?\?member`?/g, member) // Member mention substitution
      .replace(/`?\?username`?/g, member.user.username) // Username substitution
      .replace(/`?\?tag`?/g, member.user.tag) // Tag substitution
      .replace(/`?\?size`?/g, member.guild.members.cache.size); // Guild size substitution
    leaveChannel.send(new MessageEmbed().setDescription(leaveMessage).setColor(member.guild.me.displayHexColor));
  }
  
  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

};