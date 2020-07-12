const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class LeaderboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['top', 'lb', 'rankings'],
      usage: 'leaderboard [member count]',
      description: oneLine`
        Displays the server points leaderboard of the provided member count. 
        If no member count is given, the leaderboard will default to size 10.
        The max leaderboard size is 25.
      `,
      type: client.types.POINTS,
      examples: ['leaderboard 20']
    });
  }
  async run(message, args) {
    let amount = parseInt(args[0]);
    if (!amount || amount < 0) amount = 10;
    else if (amount > 25) amount = 25;
    let leaderboard = message.client.db.users.selectLeaderboard.all(message.guild.id);
    const position = leaderboard.map(row => row.user_id).indexOf(message.author.id);
    leaderboard = leaderboard.slice(0, amount);
    let count = 1;
    const members = [];
    for(const row of leaderboard) {
      members.push(oneLine`
        **${count}.** ${await message.guild.members.cache.get(row.user_id)} - \`${row.points}\` points
      `);
      count++;
    }
    const range = (amount == 1) ? '[1]' : `[1 - ${members.length}]`;
    const embed = new MessageEmbed()
      .setTitle(`Points Leaderboard ${range}`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(members.join('\n'))
      .setFooter(
        `${message.member.displayName}'s position: ${position + 1}`,  
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    return message.channel.send(embed);
  }
};
