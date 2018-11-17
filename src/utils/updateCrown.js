module.exports = (client) => {
  console.log('Updating crown owners...');
  client.guilds.forEach(async guild => {
    let row;
    try {
      row = client.getRow.get(guild.id);
      if (row.crownRole === 'none') return console.log(`No crown role in ${guild.name}.`);
    }
    catch (err) {
      return console.log(`Unable to find crown role in ${guild.name}.`);
    }
    const scoreboard = client.getScoreboard.all(guild.id);
    const winner = guild.members.get(scoreboard[0].userID);
    const crownRole = guild.roles.find(r => r.name === row.crownRole);
    await Promise.all(guild.members.map(async member => { // good alternative to handling async forEach
      if (member.roles.has(crownRole.id)) await member.removeRole(crownRole);
    }));
    await winner.addRole(crownRole);
    client.clearScore.run(guild.id);
    if (row.defaultChannelID === 'none') return;
    guild.channels.get(row.defaultChannelID).send(`Hello ${guild.defaultRole}!\nCongratulations to ${winner} for placing first this week! They have claimed the **${crownRole.name}**!\nPoints have been cleared, best of luck next time!`);
    console.log(`Successfully updated crown owner and cleared points in ${guild.name}.`);
  });
};
