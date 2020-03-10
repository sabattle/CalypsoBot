const Command = require('../Command.js');
const Discord = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class TopFiveCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'top5',
      aliases: ['t5'],
      usage: '',
      description: 'Lists the top 5 members with the most points on your server.',
      type: 'point'
    });
  }
  async run(message) {
    const leaderboard = message.client.db.guildPoints.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(message.author.id);
    const top10 = leaderboard.slice(0, 5);
    const embed = new Discord.RichEmbed()
      .setTitle(message.guild.name + ' Leaderboard (Top 5)')
      .setColor(message.guild.me.displayHexColor)
      .setFooter(`${message.member.displayName}'s position: ${position + 1}`);
    let count = 1, pointsList = [];
    for(const row of top10) {
      pointsList.push(oneLine`
        **${count}.** ${await message.guild.members.get(row.user_id).displayName} | **${row.points}** points
      `);
      count++;
    }
    embed.setDescription(pointsList.join('\n'));
    return message.channel.send(embed);
  }
};
