const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const scheduleCrown = require('../../utils/scheduleCrown.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      aliases: ['setcr', 'scr'],
      usage: 'setcrownrole <role mention | role name>',
      description: oneLine`
        Sets the role Calypso will give members with the most points each cycle. 
        Provide no role to clear the current crown role.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownrole @Crowned']
    });
  }
  run(message, args) {
    const crownRoleId = message.client.db.settings.selectCrownRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === crownRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Crown Role', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateCrownRoleId.run(null, message.guild.id);
      return message.channel.send(embed
        .setDescription('The `crown role` was successfully updated.')
        .addField('Current Value', `${oldRole} ➔ \`None\``, true)  
      );
    }

    // Update role
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role name.');
    message.client.db.settings.updateCrownRoleId.run(role.id, message.guild.id);
    message.channel.send(embed
      .setDescription(oneLine`
        The \`crown role\` was successfully updated. Please note that a \`crown schedule\` must also be set.
      `)
      .addField('Current Value', `${oldRole} ➔ ${role}`, true)
    );

    // Schedule crown role rotation
    scheduleCrown(message.client, message.guild);
  }
};
