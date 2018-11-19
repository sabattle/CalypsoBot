const Discord = require('discord.js');
const art = [
  'https://raw.githubusercontent.com/sabattle/Calypso/develop/data/images/Calypso_Full_Signature.png',
  'https://raw.githubusercontent.com/sabattle/Calypso/develop/data/images/Calypso.png',
  'https://raw.githubusercontent.com/sabattle/Calypso/develop/data/images/Calypso_WIP.png',
  'https://raw.githubusercontent.com/sabattle/Calypso/develop/data/images/Calypso_WIP_2.png',
  'https://raw.githubusercontent.com/sabattle/Calypso/develop/data/images/Calypso_WIP_3.png'
];

module.exports = {
  name: 'gallery',
  usage: '',
  description: 'Displays a gallery of Calypso\'s art.',
  tag: 'general',
  run: async (message) => {
    let n = 0;
    const back = '⬅';
    const next = '➡';
    let embed = new Discord.RichEmbed()
      .setAuthor('Gallery', message.client.user.displayAvatarURL)
      .setDescription(art[n])
      .setFooter('All art courtesy of CommradeFido#5286.')
      .setColor(message.guild.me.displayHexColor);
    const msg = await message.channel.send(embed);
    await msg.react(back);
    await msg.react(next);
    const filter = (reaction, user) => user != message.client.user;
    const collector = msg.createReactionCollector(filter);
    collector.on('collect', async reaction => {
      const reactionUsers = (await reaction.fetchUsers()).filter(u => u != message.client.user);
      reactionUsers.forEach(async user => await reaction.remove(user));
      if (reaction.emoji.name === back){
        n--;
        if (n < 0) n = art.length - 1;
      }
      else if (reaction.emoji.name === next){
        n++;
        if (n > art.length - 1) n = 0;
      }
      await embed.setDescription(art[n]);
      await msg.edit(embed);
    });
  }
};
