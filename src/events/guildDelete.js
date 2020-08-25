module.exports = (client, guild) => {

  client.logger.info(`Calypso has left ${guild.name}`);

  client.db.settings.deleteGuild.run(guild.id);
  client.db.users.deleteGuild.run(guild.id);

  if (guild.job) guild.job.cancel(); // Cancel old job

};
