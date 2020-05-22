const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class ModsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mods',
      usage: '',
      description: 'Displays a list of all current mods.',
      type: 'general'
    });
  }
  run(message) {
    const id = message.client.db.guildSettings.selectModRoleId.pluck().get(message.guild.id);
    let modRole;
    if (id) modRole = message.guild.roles.cache.get(id);
    else return message.channel.send('There is currently no `mod role` set on this server.');
    const mods = message.guild.members.cache.filter(m => {
      if (m.roles.find(r => r === modRole)) return true;
    });
    let modList = '';
    mods.forEach(m => modList = modList + `${m.displayName}\n`);
    const embed = new Discord.MessageEmbed()
      .setTitle('Mod List')
      .setFooter(`${mods.size} out of ${message.guild.members.cache.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    while (modList.length > 2048) { // Description is capped at 2048 chars
      modList = modList.substring(0, modList.lastIndexOf('\n') -2);
      const count = modList.split('\n').length;
      embed.setFooter(`
        ${mods.size} out of ${message.guild.members.cache.size} accounts
        Only ${count} of ${mods.size} mods could be displayed
      `);
    }
    embed.setDescription(modList);
    message.channel.send(embed);
  }
};