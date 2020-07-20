const Command = require('../Command.js');
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
    const embed = new MessageEmbed()
      .setTitle('Mod List [0]')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    
    // Get mod role
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    else return message.channel.send(embed.setDescription('Sorry! The `mod role` is not set on this server.'));

    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    }).array();

    let description = message.client.utils.trimStringFromArray(mods);
    if (mods.length === 0) description = 'Sorry! No mods found.';

    embed.setTitle(`Mod List [${mods.length}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Mod Role', modRole)
      .addField('Mod Count', `**${mods.length}** out of **${message.guild.members.cache.size}** accounts`);
    message.channel.send(embed);
  }
};