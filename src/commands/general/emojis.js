const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      usage: '',
      description: 'Displays a list of all current emojis.',
      type: 'general'
    });
  }
  run(message) {
    const emojis = message.guild.emojis;
    let emojiList = '';
    emojis.forEach(e => { emojiList = emojiList + `${e} :${e.name}: \n`; });
    const embed = new Discord.RichEmbed()
      .setAuthor('Emoji List', message.guild.iconURL)
      .setColor(message.guild.me.displayHexColor);
    while (emojiList.length > 2048) { // Description is capped at 2048 chars
      emojiList = emojiList.substring(0, emojiList.lastIndexOf('\n') -2);
      embed.setFooter('Capped at 2048 characters');
    }
    embed.setDescription(emojiList);
    message.channel.send(embed);
  }
};
