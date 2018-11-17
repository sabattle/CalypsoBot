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
    await Promise.all(guild.members.map(async member => { // good alternative to handling async forEach
      if (member.roles.has(crownRole.id)) await member.removeRole(crownRole);
    }));
    await winner.addRole(crownRole);
    if (row.defaultChannelID === 'none') return true;
    guild.channels.get(row.defaultChannelID).send(`Hello ${guild.defaultRole}!\nCongratulations to ${winner} for placing in first this week! They have claimed the **${crownRole.name}**!\nPoints have been cleared, best of luck next time!`);
  });
  if (stop === true) return;
  client.clearScore.run();
  console.log('Successfully updated crown owner and cleared points.');
};
