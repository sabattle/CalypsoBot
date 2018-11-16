module.exports = {
  name: 'position',
  usage: '<USER MENTION>',
  description: 'Fetches a user\'s current scoreboard position (or your own, if no user is mentioned).',
  tag: 'fun',
  run: async (message) => {
    const target =  message.mentions.members.first() || message.member;
    const scoreboard = message.client.getScoreboard.all(message.guild.id);
    const position = scoreboard.map(u => u.userID).indexOf(target.id);
    message.channel.send(`${target.displayName}'s position: **${position + 1}**`);
  }
};
