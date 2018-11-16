module.exports = (client) => {
  console.log('Updating crown owner...');
  const guilds = client.guilds;
  const stop = guilds.some(async guild => {
    let row;
    try {
      row = client.getRow.get(guild.id);
      if (row.crownRole === 'none') {
        console.log(`No crown role in ${guild.name}.`);
        return true;
      }
    }
    catch (err) {
      console.log(`Unable to update crown owner in ${guild.name}.`);
      return true;
    }
    const scoreboard = client.getScoreboard.all(guild.id);
    const winner = guild.members.get(scoreboard[0].userID);
    const crownRole = guild.roles.find(r => r.name === row.crownRole);
    await guild.members.forEach(async member => {
      if (member.roles.has(crownRole.id)) await member.removeRole(crownRole);
    });
    await winner.addRole(crownRole);
    if (row.defaultChannelID === 'none') return false;
    guild.channels.get(row.defaultChannelID).send(`Hello ${guild.defaultRole}! Congratulations to ${winner} for being first this week! They have now claimed the role: **${crownRole.name}**! Points have been cleared, best of luck next time!`);
  });
  if (stop === true) return;
  client.clearScore.run();
  console.log('Successfully updated crown owner and cleared points.');
};
