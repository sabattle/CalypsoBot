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
    if (id) modRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `mod role` on this server.');
    const mods = message.guild.members.filter(m => {
      if (m.roles.find(r => r === modRole)) return true;
    });
    let modList = '';
    mods.forEach(m => modList = modList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setTitle('Mod List')
      .setDescription(modList)
      .setFooter(`${mods.size} out of ${message.guild.members.size} accounts`)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};