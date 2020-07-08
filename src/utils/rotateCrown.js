const { oneLine } = require('common-tags');

module.exports = async function rotateCrown(client, guild, crownRole) {

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
    client.db.users.clearPoints.run(guild.id);
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

  client.logger.info(`${guild.name}: Successfully assigned crown role to ${winner.displayName} and reset points`);
};

