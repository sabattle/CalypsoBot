const schedule = require('node-schedule');
const rotateCrown = require('./rotateCrown.js');
const checkPointsDisabled = require('./checkPointsDisabled.js');

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client 
 * @param {Guild} guild
 */
module.exports = function scheduleCrown(client, guild) {

  if (checkPointsDisabled(client, guild)) return;

  const crownRoleId = client.db.settings.selectCrownRoleId.pluck().get(guild.id);
  let crownRole;
  if (crownRoleId) crownRole = guild.roles.cache.get(crownRoleId);
  const cron = client.db.settings.selectCrownSchedule.pluck().get(guild.id);
  if (crownRole && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      rotateCrown(client, guild, crownRole);
    });
    client.logger.info(`${guild.name}: Successfully scheduled job`);
  }
};