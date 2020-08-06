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

    let max = 25;
    if (emojis.length === 0) message.channel.send(embed.setDescription('Sorry! No emojis found 😢'));
    else if (emojis.length <= max) {
      const range = (emojis.length == 1) ? '[1]' : `[1 - ${emojis.length}]`;
      message.channel.send(embed
        .setTitle(`Emoji List ${range}`)
        .setDescription(emojis.join('\n'))
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
      );
    
    // Reaction Menu
    } else {

      let n = 0;
      embed
        .setTitle(`Emoji List [1 - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expires after two minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(emojis.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= 25;
        max -= 25;
        if (max < 25) max = 25;
        return new MessageEmbed(json)
          .setTitle(`Emoji List [${n + 1} - ${max}]`)
          .setDescription(emojis.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === emojis.length) return;
        n += 25;
        max += 25;
        if (max >= emojis.length) max = emojis.length;
        return new MessageEmbed(json)
          .setTitle(`Emoji List [${n + 1} - ${max}]`)
          .setDescription(emojis.slice(n, max).join('\n'));
      };

      const reactions = {
        '◀️': previous,
        '▶️': next,
      };

      new ReactionMenu(message.channel, message.member, embed, reactions);
    }
  }
};
