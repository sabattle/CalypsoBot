const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mods',
      usage: 'mods',
      description: 'Displays a list of all current mods.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
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

    const interval = 25;
    if (mods.length === 0) message.channel.send(embed.setDescription('No mods found.'));
    else if (mods.length <= interval) {
      const range = (mods.length == 1) ? '[1]' : `[1 - ${mods.length}]`;
      message.channel.send(embed
        .setTitle(`Mod List ${range}`)
        .setDescription(mods.join('\n'))
      );

    // Reaction Menu
    } else {

      embed
        .setTitle('Mod List')
        .setThumbnail(message.guild.iconURL({ dynamic: true }))
        .setFooter(
          'Expires after two minutes.\n' + message.member.displayName,  
          message.author.displayAvatarURL({ dynamic: true })
        );

      new ReactionMenu(message.client, message.channel, message.member, embed, mods, interval);
    }
  }
};