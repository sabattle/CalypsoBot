module.exports = (client, guild) => {
  
  // Update db
  client.db.settings.insertRow.run(guild.id, guild.name, guild.systemChannelID);
  guild.members.cache.forEach(member => {
    client.db.users.insertRow.run(member.id, member.user.username, guild.id, guild.name);
  });
  client.logger.info(`Calypso has joined ${guild.name}`);
};
