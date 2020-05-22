const scheduleCrown = require('../utils/scheduleCrown.js');

module.exports = (client) => {
  
  // Update presence
  client.user.setPresence({ status: 'online', activity: { name: 'your commands', type: 'LISTENING'} });

  // Update db with new servers
  client.logger.info('Updating database and scheduling jobs...');
  for (const guild of client.guilds.cache) {
    client.db.guildSettings.insertRow.run(guild.id, guild.name, guild.systemChannelID);

    // Schedule crown role rotation
    scheduleCrown(client, guild);

    // Update points table
    const userIds = client.db.guildPoints.selectUserIds.pluck().all(guild.id);
    userIds.forEach(userId => {
      const member = guild.members.cache.get(userId);
      if (member) client.db.guildPoints.insertRow.run(userId, member.user.username, guild.id, guild.name);
      else {
        const name = client.db.guildPoints.selectUserName.pluck().get(userId, guild.id);
        client.logger.info(`${guild.name}: Removing ${name} from guild_points table`);
        client.db.guildPoints.deleteRow.run(userId, guild.id);
      }
    });
  }

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.cache.size} server(s)`);
};
