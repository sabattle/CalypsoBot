const Discord = require('discord.js');

module.exports = {
  name: 'top10',
  usage: '',
  description: 'Lists the top 10 members with the most points on your server.',
  tag: 'fun',
  run: async (message) => {
    const top10 = message.client.getTop10.all(message.guild.name);
    const scoreboard = message.client.getScoreboard.all(message.guild.name);
    const position = scoreboard.map(e => e.id).indexOf(message.author.id);
    let count = 1;
    const embed = new Discord.RichEmbed()
      .setAuthor(message.guild.name + ' Leaderboard', message.guild.iconURL)
      .setThumbnail(message.guild.iconURL)
      .setDescription('The top 10!')
      .setColor((await message.guild.fetchMember(message.client.user)).displayHexColor)
      .setFooter(`${message.member.displayName}'s position: ${position + 1}`);
    for(const score of top10) {
      embed.addField(`${count}: ${await message.guild.members.get(score.id).displayName}`, `${score.points} points`);
      count++;
    }
    return message.channel.send({embed});
  }
};
