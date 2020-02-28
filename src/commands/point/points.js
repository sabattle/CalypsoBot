const Command = require('../Command.js');

module.exports = class PointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'points',
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s current points (or your own, if no user is mentioned).',
      type: 'point'
    });
  }
  run(message) {
    const target = message.mentions.members.first() || message.member;
    const enabled = message.client.db.guildSettings.selectUsePoints.pluck().get(message.guild.id);
    if (!enabled) return message.channel.send('Points are currently **disabled** on this server.');
    const points = message.client.db.guildPoints.selectPoints.pluck().get(target.id, message.guild.id);
    if (points === 1) message.channel.send(`${target} has **${points}** point!`);
    else message.channel.send(`${target} has **${points}** points!`);
  }
};
