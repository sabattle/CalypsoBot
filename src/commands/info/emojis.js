const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
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

    const interval = 25;
    if (emojis.length === 0) message.channel.send(embed.setDescription('No emojis found. 😢'));
    else if (emojis.length <= interval) {
      const range = (emojis.length == 1) ? '[1]' : `[1 - ${emojis.length}]`;
      message.channel.send(embed
        .setTitle(`Emoji List ${range}`)
        .setDescription(emojis.join('\n'))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
      );
    
    // Reaction Menu
    } else {

      embed
        .setTitle('Emoji List')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expires after two minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, emojis, interval);
    }
  }
};
