module.exports = (client) => {
  
  // Update presence
  client.user.setPresence({ status: 'online', activity: { name: 'your commands', type: 'LISTENING'} });

  client.logger.info('Updating database and scheduling jobs...');
  client.guilds.cache.forEach(guild => {

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
        member.bot ? 1 : 0
      );
    });

    // Schedule crown role rotation
    client.utils.scheduleCrown(client, guild);

  });

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.cache.size} server(s)`);
};
