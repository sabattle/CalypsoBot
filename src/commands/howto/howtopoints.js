const Command = require('../Command.js');
const { stripIndent } = require('common-tags');

module.exports = class HowToPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtopoints',
      aliases: ['h2points'],
      usage: '',
      description: 'Explains various aspects about Calypso\'s point system.',
      type: 'howto'
    });
  }
  run(message) {
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    message.channel.send(stripIndent`
    Points can be earned in the following ways:

      1. Each message sent in a text channel is worth **1** point.
      2. If enabled, each minute spent in voice chat is worth **1** point.
      3. Points can be given to others using the \`${prefix}givepoints\` command.
    
    To see current points, use the command \`${prefix}points\`. To see overall points, use \`${prefix}totalpoints\`.
    If a \`crown role\` and \`crown schedule\` are set, then the person with the most points that cycle will win!
    Additionally, everyone's points will be reset to **0** (total points will remain untouched).
    To see details about the server's **Crown**, use the \`${prefix}crown\` command.

    To check leaderboard standing, use the \`${prefix}position\` command. 
    To see the leaderboard itself, use either \`${prefix}top20\`, \`${prefix}top10\`, or \`${prefix}top5\`.
    **Please Note**: If points are disabled on your server, these commands cannot be used.
  `);
  }
};
