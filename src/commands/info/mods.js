const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mods',
      usage: 'mods',
      description: 'Displays a list of all current mods.',
      type: types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
      .setTitle('Mod List [0]')
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let modRole;
    if (modRoleId) modRole = message.guild.roles.cache.get(modRoleId);
    else return message.channel.send(embed.setDescription('Sorry! The `mod role` has not been set on this server.'));
    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === modRole)) return true;
    });
    let modList = '';
    mods.forEach(m => modList = modList + `${m.displayName}#${m.user.discriminator}\n`);
    embed.setTitle(`Mod List [${mods.size}]`)
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Mod Role', modRole)
      .addField('Mod Count', `**${mods.size}** out of **${message.guild.members.cache.size}** accounts`);
    while (modList.length > 2048) { // Description is capped at 2048 chars
      modList = modList.substring(0, modList.lastIndexOf('\n') -2);
      const count = modList.split('\n').length;
      embed.spliceFields(0, 1, { name: 'Mod Count', value: `
        **${mods.size}** out of **${message.guild.members.cache.size}** accounts
        Only **${count}** of **${mods.size}** mods can be shown
      `});
    }
    embed.setDescription(modList);
    message.channel.send(embed);
  }
};