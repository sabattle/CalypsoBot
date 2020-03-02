const schedule = require('node-schedule');
const rotateCrown = require('../utils/rotateCrown.js');

module.exports = (client) => {
  
  // Update db with new servers
  client.logger.info('Updating database and scheduling jobs...');
  client.guilds.forEach(guild => {
    client.db.guildSettings.insertRow.run(guild.id, guild.name, guild.systemChannelID);
    
    //Schedule crown role rotation
    const enabled = client.db.guildSettings.selectUseCrown.pluck().get(guild.id);
    const id = client.db.guildSettings.selectCrownRoleId.pluck().get(guild.id);
    let crownRole;
    if (id) crownRole = guild.roles.get(id);
    const cron = client.db.guildSettings.selectCrownSchedule.pluck().get(guild.id);
    if (enabled && crownRole && cron) {
      guild.job = schedule.scheduleJob(cron, rotateCrown(guild));
    }

    // Update points table
    guild.members.forEach(member => {
      client.db.guildPoints.insertRow.run(member.id, member.user.username, guild.id, guild.name);
    });
  });

  client.logger.info('Calypso is now online');
  client.logger.info(`Calypso is running on ${client.guilds.size} server(s)`);
  client.user.setPresence({ status: 'online', game: { name: 'your commands', type: 2 } });
};
