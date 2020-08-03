module.exports = async (client) => {
  
  // Update presence
  client.user.setPresence({ status: 'online', activity: { name: 'your commands', type: 'LISTENING'} });

  client.logger.info('Updating database and scheduling jobs...');
  for (const guild of client.guilds.cache.values()) {

    // Update settings table
    client.db.settings.insertRow.run(
      guild.id,
      guild.name,
      guild.systemChannelID, // Default channel
      guild.systemChannelID, // Welcome channel
      guild.systemChannelID, // Leave channel
      guild.systemChannelID  // Crown Channel
    );
    
    // Update users table
    guild.members.cache.forEach(member => {
      client.db.users.insertRow.run(
        member.id, 
        member.user.username, 
        member.user.discriminator,
        guild.id, 
        guild.name,
        member.joinedAt.toString(),
        member.user.bot ? 1 : 0
      );
    });

    // If member left
    const currentMemberIds = client.db.users.selectCurrentMembers.all(guild.id).map(row => row.user_id);
    for (const id of currentMemberIds) {
      if (!guild.members.cache.has(id)) {
        client.db.users.updateCurrentMember.run(0, id, guild.id);
        client.db.users.wipeTotalPoints.run(id, guild.id);
      }
    }

    // If member joined
    const missingMemberIds = client.db.users.selectMissingMembers.all(guild.id).map(row => row.user_id);
    for (const id of missingMemberIds) {
      if (guild.members.cache.has(id)) client.db.users.updateCurrentMember.run(1, id, guild.id);
    }

    // Fetch verification message
    const { verification_channel_id: verificationChannelId, verification_message_id: verificationMessageId } = 
      client.db.settings.selectVerification.get(guild.id);
    const verificationChannel = guild.channels.cache.get(verificationChannelId);
    if (verificationChannel) await verificationChannel.messages.fetch(verificationMessageId);

    // Schedule crown role rotation
    client.utils.scheduleCrown(client, guild);

  }

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.cache.size} server(s)`);
};
