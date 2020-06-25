const { oneLine } = require('common-tags');

module.exports = async function rotateCrown(client, guild, crownRole) {

  // Get default channel
  const id = client.db.guildSettings.selectDefaultChannelId.pluck().get(guild.id);
  let defaultChannel;
  if (id) defaultChannel = guild.channels.cache.get(id);
  
  const leaderboard = client.db.guildPoints.selectLeaderboard.all(guild.id);
  const winner = guild.members.cache.get(leaderboard[0].user_id);
  let quit = false;

  // Remove role from losers
  await Promise.all(guild.members.cache.map(async member => { // Good alternative to handling async forEach
    if (member.roles.cache.has(crownRole.id)) {
      try {
        await member.roles.remove(crownRole);
      } catch (err) {
        if (defaultChannel) return defaultChannel.send(oneLine`
          I tried to remove ${crownRole} from ${member}, but something went wrong. Please check the role hierarchy and 
          ensure I have the \`Manage Roles\` permission.
        `);
        quit = true;
      } 
    }
  }));

  if (quit) return;

  // Give role to winner
  try {
    await winner.roles.add(crownRole);
    // Clear points
    client.db.guildPoints.clearPoints.run(guild.id);
  } catch (err) {
    if (defaultChannel) return defaultChannel.send(oneLine`
      I tried to pass ${crownRole} to ${winner}, but something went wrong. Please check the role hierarchy and ensure I
      have the \`Manage Roles\` permission.
    `);
  }
  
  let crownMessage = client.db.guildSettings.selectCrownMessage.pluck().get(guild.id);
  if (crownMessage) {
    crownMessage = crownMessage.replace('?member', winner); // Member substituion
    crownMessage = crownMessage.replace('?role', crownRole); // Member substituion
  }

  // Send crown message
  if (defaultChannel && crownMessage) defaultChannel.send(crownMessage);

  client.logger.info(`${guild.name}: Successfully assigned crown role to ${winner.displayName} and reset points`);
};

