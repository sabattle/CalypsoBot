const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownmessage',
      aliases: ['setcm', 'scm'],
      usage: 'setcrownmessage <message>',
      description: oneLine`
        Sets the message Calypso will say during the crown role rotation.
        You may use \`?member\` to substitute for a user mention and \`?role\` to substitute for the crown role.
        Enter no message to clear the current crown message.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownmessage ?member has won the ?role!']
    });
  }
  run(message, args) {
    const { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const status = (crownRoleId && crownSchedule) ? '`enabled`' : '`disabled`';
    const crownRole = message.guild.roles.cache.find(r => r.id === crownRoleId) || '`None`';
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `crown message` was successfully updated. <:success:736449240728993802>')
      .addField('Role', crownRole || '`None', true)
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', status)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear message
    if (!args[0]) {
      message.client.db.settings.updateCrownMessage.run(null, message.guild.id);
      return message.channel.send(embed.addField('Message', '`None`')
      );
    }

    let crownMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    message.client.db.settings.updateCrownMessage.run(crownMessage, message.guild.id);
    if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
    message.channel.send(embed.addField('Message', `\`\`\`${crownMessage}\`\`\``)
    );
  }
};