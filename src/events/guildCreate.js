module.exports = (client, guild) => {
  // Update db
  client.db.guildSettings.insertRow.run(guild.id, guild.name, guild.systemChannelID);
  guild.members.forEach(member => {
    client.db.guildPoints.insertRow.run(member.id, member.user.username, guild.id, guild.name);
  });
  client.logger.info(`Calypso has joined ${guild.name}`);
};
