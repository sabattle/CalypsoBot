const { MessageEmbed } = require('discord.js');

module.exports = (client, member) => {

  /** ------------------------------------------------------------------------------------------------
   * LEAVE MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  if (member.guild.me.hasPermission('SEND_MESSAGES') && member.guild.me.hasPermission('EMBED_LINKS')) {
    // Send leave message
    let { leave_channel_id: leaveChannelId, leave_message: leaveMessage } = 
      client.db.settings.selectLeaveMessages.get(member.guild.id);
    const leaveChannel = member.guild.channels.cache.get(leaveChannelId);

    if (leaveChannel && leaveChannel.viewable && leaveMessage) {        
      leaveMessage = leaveMessage.replace('?member', member); // Member substitution
      leaveChannel.send(new MessageEmbed().setDescription(leaveMessage).setColor(member.guild.me.displayHexColor));
    }
  }
  
  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
  client.db.users.updateCurrentMember.run(0, member.id, member.guild.id);
  client.db.users.wipeTotalPoints.run(member.id, member.guild.id);

  client.logger.info(`${member.guild.name}: ${member.user.tag} has left the server`);
};