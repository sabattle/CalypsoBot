const Command = require('../Command.js');
const Discord = require('discord.js');

module.exports = class CrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crown',
      usage: '',
      description: 'Displays all crowned guild members, the crown role, and crown schedule.',
      type: 'point'
    });
  }
  run(message) {
    const id = message.client.db.settings.selectCrownRoleId.pluck().get(message.guild.id);
    let crownRole;
    if (id) crownRole = message.guild.roles.cache.get(id);
    else return message.channel.send('There is currently no `crown role` set on this server.');
    const crownSchedule = message.client.db.settings.selectCrownSchedule.pluck().get(message.guild.id);
    const crowned = message.guild.members.cache.filter(m => {
      if (m.roles.find(r => r === crownRole)) return true;
    });
    let crownList = '';
    crowned.forEach(m => crownList = crownList + `${m.displayName}\n`);
    const embed = new Discord.MessageEmbed()
      .setTitle(':crown: Crowned Members :crown:')
      .addField('Crown Role', crownRole)
      .setColor(message.guild.me.displayHexColor);
    while (crownList.length > 2048) { // Description is capped at 2048 chars
      crownList = crownList.substring(0, crownList.lastIndexOf('\n') -2);
      const count = crownList.split('\n').length;
      embed.setFooter(`Only ${count} of ${crowned.size} members could be displayed`);
    }
    embed.setDescription(crownList);
    if (crownSchedule) embed.addField('Crown Schedule', crownSchedule);
    message.channel.send(embed);
  }
};