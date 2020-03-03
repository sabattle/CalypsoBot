const scheduleCrown = require('../utils/scheduleCrown.js');

module.exports = (client) => {
  
  // Update db with new servers
  client.logger.info('Updating database and scheduling jobs...');
  client.guilds.forEach(guild => {
    client.db.guildSettings.insertRow.run(guild.id, guild.name, guild.systemChannelID);

    // Schedule crown role rotation
    scheduleCrown(client, guild);

    // Update points table
    guild.members.forEach(member => {
      client.db.guildPoints.insertRow.run(member.id, member.user.username, guild.id, guild.name);
    });
  });

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.size} server(s)`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
