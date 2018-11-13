module.exports = (client) => {
  console.log('Updating crown...');
  const guilds = client.guilds;
  guilds.forEach(async guild => {
    const row = client.getRow.get(guild.id);
    const crown = row.crown;
    if (crown === 'none') return;
    const scoreboard = client.getScoreboard.all(guild.name);
    const winner = guild.members.get(scoreboard[0].id);
    const crownRole = guild.roles.find('name', crown);
    guild.members.forEach(async member => {
      if (member.roles.find('name', crown)) await member.removeRoles(crownRole);
    });
    await winner.addRole(crownRole);
    if (row.welcome === 'none') return;
    guild.channels.get(row.welcome).send(`Hello ${guild.defaultRole}!
      Congratulations to ${winner} for being first this week! They now have the ${crownRole} role! Points have been cleared for this week, best of luck next time!`);
  });
  client.clearScore.run();
  console.log('Sucessfully updated crown owner and cleared points.');
};
