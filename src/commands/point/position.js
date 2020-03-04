const Command = require('../Command.js');

module.exports = class PositionCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'position',
      aliases: ['pos'],
      usage: '<USER MENTION>',
      description: 'Fetches a user\'s current scoreboard position (or your own, if no user is mentioned).',
      type: 'point'
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) || message.member;
    const leaderboard = message.client.db.guildPoints.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(member.id);
    message.channel.send(`${member}'s position: **${position + 1}**`);
  }
};
