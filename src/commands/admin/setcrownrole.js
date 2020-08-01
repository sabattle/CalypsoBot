const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      aliases: ['setcr', 'scr'],
      usage: 'setcrownrole <role mention/ID>',
      description: oneLine`
        Sets the role Calypso will give to the member with the most points each cycle.
        Provide no role to clear the current crown role.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownrole @Crowned']
    });
  }
  run(message, args) {
    const { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    let status, oldStatus = (crownRoleId && crownSchedule) ? '`enabled`' : '`disabled`';
    const oldRole = message.guild.roles.cache.find(r => r.id === crownRoleId) || '`None`';
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    const embed = new MessageEmbed()
      .setTitle('Setting: `Crown System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `crown role` was successfully updated. <:success:736449240728993802>')
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Schedule', `\`${crownSchedule}\`` || '`None`', true)
      .addField('Message', crownMessage || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear role
    if (args.length === 0) {
      message.client.db.settings.updateCrownRoleId.run(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); // Cancel old job
      
      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';

      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Role', value: `${oldRole} ➔ \`None\``, inline: true })
        .spliceFields(3, 0, { name: 'Status', value: status })
      );
    }

    // Update role
    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateCrownRoleId.run(role.id, message.guild.id);

    // Check status
    if (oldStatus != '`enabled`' && role && crownSchedule) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Role', value: `${oldRole} ➔ ${role}`, inline: true })
      .spliceFields(3, 0, { name: 'Status', value: status })
    );

    // Schedule crown role rotation
    message.client.utils.scheduleCrown(message.client, message.guild);
  }
};
