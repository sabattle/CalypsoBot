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
    const id = message.client.db.guildSettings.selectCrownRoleId.pluck().get(message.guild.id);
    let crownRole;
    if (id) crownRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `crown role` set on this server.');
    const crownSchedule = message.client.db.guildSettings.selectCrownSchedule.pluck().get(message.guild.id);
    const crowned = message.guild.members.filter(m => {
      if (m.roles.find(r => r === crownRole)) return true;
    });
    let crownList = '';
    crowned.forEach(m => crownList = crownList + `${m.displayName}\n`);
    const embed = new Discord.RichEmbed()
      .setTitle(':crown: Crowned Members :crown:')
      .setDescription(crownList)
      .addField('Crown Role', crownRole)
      .setColor(message.guild.me.displayHexColor);
    if (crownSchedule) embed.addField('Crown Schedule', crownSchedule);
    message.channel.send(embed);
  }
};