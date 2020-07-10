const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ExplainPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'explainpoints',
      aliases: ['explainp', 'ep', 'howtopoints', 'h2points'],
      usage: 'explainpoints',
      description: 'Explains the various aspects about Calypso\'s point system.',
      type: types.POINTS
    });
  }
  run(message) {

    // Get disabled commands
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const messagePoints = message.client.db.settings.selectMessagePoints.pluck().get(message.guild.id);
    const commandPoints = message.client.db.settings.selectCommandPoints.pluck().get(message.guild.id);
    const voicePoints = message.client.db.settings.selectVoicePoints.pluck().get(message.guild.id);

    // Points per
    let pointsPer = stripIndent`
      **1.** Each message sent in a text channel is worth **${messagePoints}** point(s).
      **2.** Each Calypso command used is worth **${commandPoints}** point(s). 
      **3.** Each minute spent in voice chat is worth **${voicePoints}** point(s).
    `;
    if (!disabledCommands.includes('givepoints'))
      pointsPer = pointsPer + `\n**4.** Points can be given to others using the \`${prefix}givepoints\` command.`;
 
    if (!disabledCommands.includes('pointsper'))
      pointsPer = pointsPer + `
        \nTo quickly see your server's points per action again, you may use the command \`${prefix}pointsper\`.
      `;

    // Helpful commands
    let helpfulCommands = '';

    if (!disabledCommands.includes('currentpoints'))
      helpfulCommands = helpfulCommands + ` To see current points, use the command \`${prefix}currentpoints\`.`;
    
    if (!disabledCommands.includes('totalpoints'))
      helpfulCommands = helpfulCommands + ` To see overall points, use \`${prefix}totalpoints\`.`;

    if (!disabledCommands.includes('position'))
      helpfulCommands = helpfulCommands + ` To check leaderboard standing, use the \`${prefix}position\` command.`;
      
    if (!disabledCommands.includes('leaderboard'))
      helpfulCommands = helpfulCommands + ` To see the leaderboard itself, use the \`${prefix}leaderboard\` command.`;
    
    // Crown info
    let crownInfo = stripIndent`
      If a \`crown role\` and \`crown schedule\` are set, then the person with the most points that cycle will win!` +
      ` Additionally, everyone's points will be reset to **0** (total points will remain untouched).
    `;

    if (!disabledCommands.includes('crown'))
      crownInfo = crownInfo + `\nTo see details about the server's **Crown**, use the \`${prefix}crown\` command.`;

    const embed = new MessageEmbed()
      .setTitle('Points System')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Earning Points', pointsPer)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (helpfulCommands) embed.addField('Helpful Commands', helpfulCommands);
    embed.addField('Crown Info', crownInfo);
    message.channel.send(embed);
  }
};
