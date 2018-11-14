module.exports = {
  name: 'points',
  usage: '<USER MENTION>',
  description: 'Fetches a user\'s current points (or your own points, if no user is mentioned).',
  tag: 'fun',
  run: async (message) => {
    const target = message.mentions.members.first() || message.member;
    const score = message.client.getScore.get(target.id, message.guild.name);
    if (!score) message.channel.send(`${target.displayName} has **0** points!`);
    else if (score.points === 1) message.channel.send(`${target.displayName} has **${score.points}** point!`);
    else message.channel.send(`${target.displayName} has **${score.points}** points!`);
  }
};
