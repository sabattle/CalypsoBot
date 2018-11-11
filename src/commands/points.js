module.exports = {
  name: 'points',
  usage: '<USER MENTION>',
  description: 'Fetches a user\'s current points (or your own points, if no user is mentioned).',
  tag: 'fun',
  run: async (message) => {
    let target = message.mentions.members.first() || message.member;
    let score = message.client.getScore.get(target.id, message.guild.name);
    if (!score) message.channel.send(`${target.displayName} has **0** points!`);
    else message.channel.send(`${target.displayName} has **${score.points}** points!`);
  }
};
