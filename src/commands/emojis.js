const Discord = require('discord.js');

module.exports = {
  name: 'emojis',
  usage: '',
  description: 'Displays a list of all current emojis.',
  tag: 'general',
  run: (message) => {
    let emojis = message.guild.emojis;
    let emojiList = '';
    emojis.forEach(e => emojiList = emojiList + `${e} :${e.name}: \n`);
    let embed = new Discord.RichEmbed()
      .setAuthor('Emoji List', message.guild.iconURL)
      .setDescription(emojiList)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
