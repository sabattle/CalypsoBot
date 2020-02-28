module.exports = (client) => {
  
  // Update db with new servers
  client.logger.info('Updating database...');
  client.guilds.forEach(guild => {
    client.db.guildSettings.insertRow.run(guild.id, guild.name, guild.systemChannelID);
    guild.members.forEach(member => {
      client.db.guildPoints.insertRow.run(member.id, member.user.username, guild.id, guild.name);
    });
  });

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.size} server(s)`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
