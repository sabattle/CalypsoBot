const { MessageEmbed } = require('discord.js');
const schedule = require('node-schedule');
const { stripIndent } = require('common-tags');

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
    arr.push(`and **${len}** more...`);
  }
  return arr;
}

/**
 * Trims joined array to specified size
 * @param {Array} arr
 * @param {int} maxLen
 * @param {string} joinChar
 */
function trimStringFromArray(arr, maxLen = 2048, joinChar = '\n') {
  let string = arr.join(joinChar);
  const diff = maxLen - 15; // Leave room for "And ___ more..."
  if (string.length > maxLen) {
    string = string.slice(0, string.length - (string.length - diff)); 
    string = string.slice(0, string.lastIndexOf(joinChar));
    string = string + `\nAnd **${arr.length - string.split('\n').length}** more...`;
  }
  return string;
}

/**
 * Gets current array window range
 * @param {Array} arr
 * @param {int} current
 * @param {int} interval
 */
function getRange(arr, current, interval) {
  const max = (arr.length > current + interval) ? current + interval : arr.length;
  current = current + 1;
  const range = (arr.length == 1 || arr.length == current || interval == 1) ? `[${current}]` : `[${current} - ${max}]`;
  return range;
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
 * Gets the next moderation case number
 * @param {Client} client 
 * @param {Guild} guild
 */
async function getCaseNumber(client, guild, modLog) {
  
  const message = (await modLog.messages.fetch({ limit: 100 })).filter(m => m.member === guild.me &&
    m.embeds[0] &&
    m.embeds[0].type == 'rich' &&
    m.embeds[0].footer &&
    m.embeds[0].footer.text &&
    m.embeds[0].footer.text.startsWith('Case')
  ).first();
  
  if (message) {
    const footer = message.embeds[0].footer.text;
    const num = parseInt(footer.split('#').pop());
    if (!isNaN(num)) return num + 1;
  }

  return 1;
}

/**
 * Gets current status
 * @param {...*} args
 */
function getStatus(...args) {
  for (const arg of args) {
    if (!arg) return 'disabled';
  }
  return 'enabled';
}

/**
 * Surrounds welcome/farewell message keywords with backticks
 * @param {string} message
 */
function replaceKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?size/g, '`?size`');
}

/**
 * Surrounds crown message keywords with backticks
 * @param {string} message
 */
function replaceCrownKeywords(message) {
  if (!message) return message;
  else return message
    .replace(/\?member/g, '`?member`')
    .replace(/\?username/g, '`?username`')
    .replace(/\?tag/g, '`?tag`')
    .replace(/\?role/g, '`?role`')
    .replace(/\?points/g, '`?points`');
}

/**
 * Transfers crown from one member to another
 * @param {Client} client 
 * @param {Guild} guild
 * @param {Role} crownRole
 */
async function transferCrown(client, guild, crownRoleId) {

  const crownRole = guild.roles.cache.get(crownRoleId);
  
  // If crown role is unable to be found
  if (!crownRole) {
    return client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
      Unable to transfer crown role, it may have been modified or deleted
    `);
  }
  
  const leaderboard = client.db.users.selectLeaderboard.all(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  const points = client.db.users.selectPoints.pluck().get(winner.id, guild.id);
  let quit = false;

  // Remove role from losers
  await Promise.all(guild.members.cache.map(async member => { // Good alternative to handling async forEach
    if (member.roles.cache.has(crownRole.id)) {
      try {
        await member.roles.remove(crownRole);
      } catch (err) {

        quit = true;
        
        return client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
          Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
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
    return client.sendSystemErrorMessage(guild, 'crown update', stripIndent`
      Unable to transfer crown role, please check the role hierarchy and ensure I have the Manage Roles permission
    `, err.message);
  }
  
  // Get crown channel and crown channel
  let { crown_channel_id: crownChannelId, crown_message: crownMessage } = 
    client.db.settings.selectCrown.get(guild.id);
  const crownChannel = guild.channels.cache.get(crownChannelId);

  // Send crown message
  if (
    crownChannel &&
    crownChannel.viewable &&
    crownChannel.permissionsFor(guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    crownMessage
  ) {
    crownMessage = crownMessage
      .replace(/`?\?member`?/g, winner) // Member mention substitution
      .replace(/`?\?username`?/g, winner.user.username) // Username substitution
      .replace(/`?\?tag`?/g, winner.user.tag) // Tag substitution
      .replace(/`?\?role`?/g, crownRole) // Role substitution
      .replace(/`?\?points`?/g, points); // Points substitution
    crownChannel.send(new MessageEmbed().setDescription(crownMessage).setColor(guild.me.displayHexColor));
  }

  client.logger.info(`${guild.name}: Assigned crown role to ${winner.user.tag} and reset server points`);
}

/**
 * Schedule crown role rotation if checks pass
 * @param {Client} client 
 * @param {Guild} guild
 */
function scheduleCrown(client, guild) {

  const { crown_role_id: crownRoleId, crown_schedule: cron } = client.db.settings.selectCrown.get(guild.id);

  if (crownRoleId && cron) {
    guild.job = schedule.scheduleJob(cron, () => {
      client.utils.transferCrown(client, guild, crownRoleId);
    });
    client.logger.info(`${guild.name}: Successfully scheduled job`);
  }
}

module.exports = {
  capitalize,
  removeElement,
  trimArray,
  trimStringFromArray,
  getRange,
  getOrdinalNumeral,
  getCaseNumber,
  getStatus,
  replaceKeywords,
  replaceCrownKeywords,
  transferCrown,
  scheduleCrown
};