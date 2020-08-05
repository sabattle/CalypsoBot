const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'crown',
      aliases: ['crowned'],
      usage: 'crown',
      description: 'Displays all crowned guild members, the crown role, and crown schedule.',
      type: client.types.POINTS
    });
  }
  run(message) {
    const { crown_role_id: crownRoleId, crown_schedule: crownSchedule } = 
      message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId) || '`None`';
    const crowned = message.guild.members.cache.filter(m => {
      if (m.roles.cache.find(r => r === crownRole)) return true;
    }).array();

    let description = message.client.utils.trimStringFromArray(crowned);
    if (crowned.length === 0) description = 'No one has the crown!';

    const embed = new MessageEmbed()
      .setTitle(':crown:  Crowned Members  :crown:')
      .setDescription(description)
      .addField('Crown Role', crownRole)
      .addField('Crown Schedule', `\`${crownSchedule || 'None'}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};