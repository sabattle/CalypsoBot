const Command = require('../Command.js');

module.exports = class TotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'totalpoints',
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s total points (or your own, if no user is mentioned).',
      type: 'point'
    });
  }
  run(message) {
    const target = message.mentions.members.first() || message.member;
    const points = message.client.db.guildPoints.selectTotalPoints.pluck().get(target.id, message.guild.id);
    if (points === 1) message.channel.send(`${target} has **${points}** total point!`);
    else message.channel.send(`${target} has **${points}** total points!`);
  }
};
