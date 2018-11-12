const Discord = require('discord.js');

module.exports = {
  name: 'emojis',
  usage: '',
  description: 'Displays a list of all current emojis.',
  tag: 'general',
  run: (message) => {
    const emojis = message.guild.emojis;
    let emojiList = '';
    emojis.forEach(e => emojiList = emojiList + `${e} :${e.name}: \n`);
    const embed = new Discord.RichEmbed()
      .setAuthor('Emoji List', message.guild.iconURL)
      .setDescription(emojiList)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
