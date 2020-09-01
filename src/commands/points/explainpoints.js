const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { stripIndent } = require('common-tags');

module.exports = class ExplainPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'explainpoints',
      aliases: ['explainp', 'ep', 'howtopoints', 'h2points'],
      usage: 'explainpoints',
      description: 'Explains the various aspects about Calypso\'s points and crown systems.',
      type: client.types.POINTS
    });
  }
  run(message) {

    // Get disabled leaderboard
    let disabledCommands = message.client.db.settings.selectDisabledCommands.pluck().get(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    const { message_points: messagePoints, command_points: commandPoints, voice_points: voicePoints } 
      = message.client.db.settings.selectPoints.get(message.guild.id);

    // Points per
    let earningPoints = 
      stripIndent`You can earn points in the following ways: by sending **messages**, by using **commands**,` +
      ' and by spending time in **voice chat**.';
    if (!disabledCommands.includes('givepoints')) earningPoints += 
      ` And if someone's feeling generous, they can give you points by using the \`${prefix}givepoints\` command.`;
    
    const pointsPer = stripIndent`
      Message Points :: ${messagePoints} per message
      Command Points :: ${commandPoints} per command
      Voice Points   :: ${voicePoints} per minute
    `;

    earningPoints += ` Here is this server's **points per action**:\n\`\`\`asciidoc\n${pointsPer}\`\`\``;
 
    if (!disabledCommands.includes('pointsper'))
      earningPoints += `
        To quickly see your server's points per action again, you may use the command \`${prefix}pointsper\`.
      `;

    // Checking points
    let checkingPoints = '';

    if (!disabledCommands.includes('points'))
      checkingPoints += `\nTo see current points, use the \`${prefix}points\` command.`;
    
    if (!disabledCommands.includes('totalpoints'))
      checkingPoints += ` To see overall points, use the \`${prefix}totalpoints\` command.`;

    // The Leaderboard
    let leaderboard = '';

    if (!disabledCommands.includes('position'))
      leaderboard += ` To check leaderboard standing, use the \`${prefix}position\` command.`;
      
    if (!disabledCommands.includes('leaderboard'))
      leaderboard += ` To see the leaderboard itself, use the \`${prefix}leaderboard\` command.`;
    
    // The Crown
    let crown = stripIndent`
      If a \`crown role\` and \`crown schedule\` are set, then the person with the most points that cycle will win!` +
      ` Additionally, everyone's points will be reset to **0** (total points will remain untouched).
    `;

    if (!disabledCommands.includes('crown'))
      crown += `\nUse the \`${prefix}crown\` command for server specific information.`;

    const embed = new MessageEmbed()
      .setTitle('Points and Crown')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Earning Points', earningPoints)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (checkingPoints) embed.addField('Checking Points', checkingPoints);
    if (leaderboard) embed.addField('The Leaderboard', leaderboard);
    embed.addField('The Crown', crown);
    message.channel.send(embed);
  }
};
