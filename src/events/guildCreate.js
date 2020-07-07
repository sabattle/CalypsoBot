module.exports = (client, guild) => {
  
  // Update db
  client.db.settings.insertRow.run(
    guild.id,
    guild.name,
    guild.systemChannelID, // Default channel
    guild.systemChannelID, // Welcome channel
    guild.systemChannelID, // Leave channel
    guild.systemChannelID  // Crown Channel
  );
  guild.members.cache.forEach(member => {
    client.db.guildPoints.insertRow.run(member.id, member.user.username, guild.id, guild.name);
  });
  client.logger.info(`Calypso has joined ${guild.name}`);
};
