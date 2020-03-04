const Command = require('../Command.js');

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      aliases: ['p'],
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s current points (or your own, if no user is mentioned).',
      type: 'point'
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.member;
    const points = message.client.db.guildPoints.selectPoints.pluck().get(member.id, message.guild.id);
    if (points === 1) message.channel.send(`${member} has **${points}** point!`);
    else message.channel.send(`${member} has **${points}** points!`);
  }
};
