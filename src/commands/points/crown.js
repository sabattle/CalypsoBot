const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crown',
      aliases: ['crowned'],
      usage: 'crown',
      description: 'Displays all crowned guild members, the crown role, and crown schedule (if set).',
      type: client.types.POINTS
    });
  }
  run(message) {
    const crownRoleId = message.client.db.settings.selectCrownRoleId.pluck().get(message.guild.id);
    let crownRole;
    const embed = new MessageEmbed()
      .setTitle(':crown:  Crowned Members  :crown:')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (crownRoleId) crownRole = message.guild.roles.cache.get(crownRoleId);
    else return message.channel.send(embed.setDescription('Sorry! The `crown role` is not set on this server.'));
    const crownSchedule = message.client.db.settings.selectCrownSchedule.pluck().get(message.guild.id);
    const crowned = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === crownRole)) return true;
    }).array();

    let description = message.client.utils.trimStringFromArray(crowned);
    if (crowned.length === 0) description = 'No one has the crown!';

    embed.setDescription(description);
    embed.addField('Crown Role', crownRole);
    if (crownSchedule) embed.addField('Crown Schedule', `\`${crownSchedule}\``);
    message.channel.send(embed);
  }
};