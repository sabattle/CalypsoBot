const schedule = require('node-schedule');
const rotateCrown = require('./rotateCrown.js');

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client 
 * @param {Guild} guild
 */
module.exports = function scheduleCrown(client, guild) {
  const pointsEnabled = client.db.guildSettings.selectPointsEnabled.pluck().get(guild.id);
  const id = client.db.guildSettings.selectCrownRoleId.pluck().get(guild.id);
  let crownRole;
  if (id) crownRole = guild.roles.cache.get(id);
  const cron = client.db.guildSettings.selectCrownSchedule.pluck().get(guild.id);
  if (pointsEnabled && crownRole && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      rotateCrown(client, guild, crownRole);
    });
    client.logger.info(`${guild.name}: Successfully scheduled job`);
  }
};