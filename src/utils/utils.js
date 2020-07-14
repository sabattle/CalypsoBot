const schedule = require('node-schedule');
const { oneLine } = require('common-tags');

/**
 * Capitalizes a string
 * @param {string} string 
 */
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Removes specifed array element
 * @param {Array} arr
 * @param {*} value
 */
function removeElement(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

/**
 * Trims array down to specified size
 * @param {Array} arr
 * @param {int} maxLen
 */
function trimArray(arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen;
    arr = arr.slice(0, maxLen);
    arr.push(`\nAnd **${len}** more...`);
  }
  return arr;
}

/**
 * Gets the ordinal numeral of a number
 * @param {int} number
 */
function getOrdinalNumeral(number) {
  number = number.toString();
  if (number === '11' || number === '12' || number === '13') return number + 'th';
  if (number.endsWith(1)) return number + 'st';
  else if (number.endsWith(2)) return number + 'nd';
  else if (number.endsWith(3)) return number + 'rd';
  else return number + 'th';
}

/**
 * Checks if points are disabled on a server
 * @param {Client} client 
 * @param {Guild} guild
 */
function checkPointsDisabled(client, guild, disabledCommands = null) {
  
  // Get disabled commands
  if (!disabledCommands) {
    disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
  }

  // Check if points are disabled
  const commands = client.commands.array()
    .filter(c => c.type === client.types.POINTS && !disabledCommands.includes(c.name));
  if (commands.length === 0) return true;
  else return false;

}

/**
 * Transfers crown from one member to another
 * @param {Client} client 
 * @param {Guild} guild
 * @param {Role} crownRole
 */
async function transferCrown(client, guild, crownRole) {

  // Get default channel
  const crownChannelId = client.db.settings.selectCrownChannelId.pluck().get(guild.id);
  let crownChannel;
  if (crownChannelId) crownChannel = guild.channels.cache.get(crownChannelId);
  
  const leaderboard = client.db.users.selectLeaderboard.all(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  let quit = false;

  // Remove role from losers
  await Promise.all(guild.members.cache.map(async member => { // Good alternative to handling async forEach
    if (member.roles.cache.has(crownRole.id)) {
      try {
        await member.roles.remove(crownRole);
      } catch (err) {

        quit = true;
        
        return client.sendSystemErrorMessage(guild, 'crown update', oneLine`
          Something went wrong. Unable to remove ${crownRole} from ${member}. 
          Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
        `, err.message);
      } 
    }
  }));

  if (quit) return;

  // Give role to winner
  try {
    await winner.roles.add(crownRole);
    // Clear points
    client.db.users.wipeAllPoints.run(guild.id);
  } catch (err) {
    return client.sendSystemErrorMessage(guild, 'crown update', oneLine`
      Something went wrong. Unable to pass ${crownRole} to ${winner}. 
      Please check the role hierarchy and ensure I have the \`Manage Roles\` permission.
    `, err.message);
  }
  
  let crownMessage = client.db.settings.selectCrownMessage.pluck().get(guild.id);
  if (crownMessage) {
    crownMessage = crownMessage.replace('?member', winner); // Member substituion
    crownMessage = crownMessage.replace('?role', crownRole); // Role substituion
  }

  // Send crown message
  if (crownChannel && crownMessage) crownChannel.send(crownMessage);

  client.logger.info(`${guild.name}: Successfully assigned crown role to ${winner.user.tag} and reset server points`);
}

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client 
 * @param {Guild} guild
 */
function scheduleCrown(client, guild) {

  if (client.utils.checkPointsDisabled(client, guild)) return;

  const crownRoleId = client.db.settings.selectCrownRoleId.pluck().get(guild.id);
  let crownRole;
  if (crownRoleId) crownRole = guild.roles.cache.get(crownRoleId);
  const cron = client.db.settings.selectCrownSchedule.pluck().get(guild.id);
  if (crownRole && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      client.utils.transferCrown(client, guild, crownRole);
    });
    client.logger.info(`${guild.name}: Successfully scheduled job`);
  }
}

module.exports = {
  capitalize,
  removeElement,
  trimArray,
  getOrdinalNumeral,
  checkPointsDisabled,
  transferCrown,
  scheduleCrown
};