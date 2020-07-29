module.exports = (client, oldGuild, newGuild) => {
  
  if (oldGuild.name == newGuild.name) return;
  
  // Update DB with new name
  client.db.settings.updateGuildName.run(newGuild.name, oldGuild.id);
  client.db.users.updateGuildName.run(newGuild.name, oldGuild.id);

  client.logger.info(`${oldGuild.name} server name changed to ${newGuild.name}`);
};
