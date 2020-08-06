const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mods',
      usage: 'mods',
      description: 'Displays a list of all current mods.',
      type: client.types.INFO
    });
  }
  run(message) {
    
    // Get mod role
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const modRole = message.guild.roles.cache.get(modRoleId) || '`None`';

    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).sort((a, b) => (a.joinedAt > b.joinedAt) ? 1 : -1).array();

    const embed = new MessageEmbed()
      .setTitle(`Mod List [${mods.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Mod Role', modRole)
      .addField('Mod Count', `**${mods.length}** out of **${message.guild.members.cache.size}** members`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    let max = 25;
    if (mods.length === 0) message.channel.send(embed.setDescription('No mods found.'));
    else if (mods.length <= max) {
      const range = (mods.length == 1) ? '[1]' : `[1 - ${mods.length}]`;
      message.channel.send(embed
        .setTitle(`Mod List ${range}`)
        .setDescription(mods.join('\n'))
      );

    // Reaction Menu
    } else {

      let n = 0;
      embed
        .setTitle(`Mod List [${n + 1} - ${max}]`)
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expires after two minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(mods.slice(n, max).join('\n'));

      const json = embed.toJSON();

      const previous = () => {
        if (n === 0) return;
        n -= 25;
        max -= 25;
        if (max < 25) max = 25;
        return new MessageEmbed(json)
          .setTitle(`Mod List [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const next = () => {
        if (max === mods.length) return;
        n += 25;
        max += 25;
        if (max >= mods.length) max = mods.length;
        return new MessageEmbed(json)
          .setTitle(`Mod List [${n + 1} - ${max}]`)
          .setDescription(mods.slice(n, max).join('\n'));
      };

      const reactions = {
        '◀️': previous,
        '▶️': next,
      };

      new ReactionMenu(message.channel, message.member, embed, reactions);
    }
  }
};