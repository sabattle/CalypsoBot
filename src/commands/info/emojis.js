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

    const embed = new MessageEmbed()
      .setTitle(`Emoji List [${message.guild.emojis.cache.size}]`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Trim array
    let description = message.client.utils.trimStringFromArray(emojis);
    if (description.length === 0) description = 'Sorry! No emojis found 😢';
    else embed.setThumbnail(message.guild.iconURL({ dynamic: true }));

    message.channel.send(embed.setDescription(description));
  }
};
