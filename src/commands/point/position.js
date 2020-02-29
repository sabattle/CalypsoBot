const Command = require('../Command.js');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s current scoreboard position (or your own, if no user is mentioned).',
      type: 'point'
    });
  }
  run(message) {
    const target = message.mentions.members.first() || message.member;
    const leaderboard = message.client.db.guildPoints.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(target.id);
    message.channel.send(`${target}'s position: **${position + 1}**`);
  }
};
