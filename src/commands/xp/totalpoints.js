const Command = require('../Command.js');

module.exports = class TotalPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'totalpoints',
      aliases: ['tp'],
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s total points (or your own, if no user is mentioned).',
      type: types.XP
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.member;
    const points = message.client.db.users.selectTotalPoints.pluck().get(member.id, message.guild.id);
    if (points === 1) message.channel.send(`${member} has **${points}** total point!`);
    else message.channel.send(`${member} has **${points}** total points!`);
  }
};
