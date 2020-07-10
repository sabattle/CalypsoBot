const Command = require('../Command.js');
const { stripIndent } = require('common-tags');

module.exports = class HowToPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtopoints',
      aliases: ['how2points', 'h2points'],
      usage: '',
      description: 'Explains various aspects about Calypso\'s point system.',
      type: types.POINTS
    });
  }
  run(message) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const messagePoints = message.client.db.settings.selectMessagePoints.pluck().get(message.guild.id);
    const commandPoints = message.client.db.settings.selectCommandPoints.pluck().get(message.guild.id);
    const voicePoints = message.client.db.settings.selectVoicePoints.pluck().get(message.guild.id);
    message.channel.send(stripIndent`
    Points can be earned in a variety of ways. Here is **${message.guild.name}**'s point breakdown:

      1. Each message sent in a text channel is worth **${messagePoints}** point(s).
      2. Each Calypso command used is worth **${commandPoints}** point(s). 
      3. Each minute spent in voice chat is worth **${voicePoints}** point(s).
      4. Points can be given to others using the \`${prefix}givepoints\` command.
    
    To quickly see your server's point breakdown again, you may also use the command \`${prefix}pointbreakdown\`.
    
    To see current points, use the command \`${prefix}points\`. To see overall points, use \`${prefix}totalpoints\`.
    If a \`crown role\` and \`crown schedule\` are set, then the person with the most points that cycle will win!
    Additionally, everyone's points will be reset to **0** (total points will remain untouched).
    To see details about the server's **Crown**, use the \`${prefix}crown\` command.

    To check leaderboard standing, use the \`${prefix}position\` command. 
    To see the leaderboard itself, use either \`${prefix}top20\`, \`${prefix}top10\`, or \`${prefix}top5\`.
    **Please Note:** If points are disabled on your server, these commands cannot be used.
  `);
  }
};
