const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EmojisCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojis',
      aliases: ['e'],
      usage: 'emojis',
      description: 'Displays a list of all current emojis.',
      type: client.types.INFO
    });
  }
  run(message) {

    const emojis = [];
    message.guild.emojis.cache.forEach(e => emojis.push(`${e} **-** \`:${e.name}:\``));

    // Trim array
    let description = emojis.join('\n');
    if (description.length === 0) description = 'No emojis found 😞';
    else if (description.length > 2048) {
      description = description.slice(0, description.length - (description.length - 2033)); // 2048 - "And ___ more..."
      description = description.slice(0, description.lastIndexOf('\n'));
      description = description + `\nAnd **${emojis.length - description.split('\n').length}** more...`;
    }
    
    const embed = new MessageEmbed()
      .setTitle(`Emoji List [${message.guild.emojis.cache.size}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
