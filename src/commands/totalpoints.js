module.exports = {
  name: 'totalpoints',
  usage: '<USER MENTION>',
  description: 'Fetches a user\'s all-time total points (or your own total points, if no user is mentioned).',
  tag: 'fun',
  run: async (message) => {
    const target = message.mentions.members.first() || message.member;
    const score = message.client.getScore.get(target.id, message.guild.id);
    if (!score) message.channel.send(`${target} has **0** all-time points!`);
    else if (score.totalPoints === 1) message.channel.send(`${target} has **${score.totalPoints}** all-time point!`);
    else if (score.totalPoints <= 10000) message.channel.send(`${target} has **${score.totalPoints}** all-time points!`);
    else if (score.totalPoints <= 100000) message.channel.send(`${target} has **${score.totalPoints}** all-time points! Wow, that's a lot!`);
    else message.channel.send(`${target} has **${score.totalPoints}** all-time points! Holy guacamole!`);
  }
};
