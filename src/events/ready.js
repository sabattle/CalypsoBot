module.exports = (client) => {
  
  // Update presence
  client.user.setPresence({ status: 'online', activity: { name: 'your commands', type: 'LISTENING'} });

  // Update db with new servers
  client.logger.info('Updating database and scheduling jobs...');
  client.guilds.cache.forEach(guild => {
    client.db.settings.insertRow.run(
      guild.id,
      guild.name,
      guild.systemChannelID, // Default channel
      guild.systemChannelID, // Welcome channel
      guild.systemChannelID, // Leave channel
      guild.systemChannelID  // Crown Channel
    );

    // Schedule crown role rotation
    client.utils.scheduleCrown(client, guild);

    // Update users table
    guild.members.cache.forEach(member => {
      client.db.users.insertRow.run(member.id, member.user.username, guild.id, guild.name);
    });
  });

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.cache.size} server(s)`);
};
