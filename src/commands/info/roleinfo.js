const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const permissions = require('../../utils/permissions.json');

module.exports = class RoleInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roleinfo',
      aliases: ['role', 'ri'],
      usage: 'roleinfo <role mention/ID>',
      description: 'Fetches information about the provided role.',
      type: client.types.INFO,
      examples: ['roleinfo @Member']
    });
  }
  run(message, args) {

    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role)
      return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');

    // Get role permissions
    const rolePermissions = role.permissions.toArray();
    const finalPermissions = [];
    for (const permission in permissions) {
      if (rolePermissions.includes(permission)) finalPermissions.push(`+ ${permissions[permission]}`);
      else finalPermissions.push(`- ${permissions[permission]}`);
    }

    // Reverse role position
    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new MessageEmbed()
      .setTitle('Role Information')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Role', role, true)
      .addField('Role ID', `\`${role.id}\``, true)
      .addField('Position', position, true)
      .addField('Mentionable', `\`${role.mentionable}\``, true)
      .addField('Bot Role', `\`${role.managed}\``, true)
      .addField('Color', `\`${role.hexColor.toUpperCase()}\``, true)
      .addField('Members', `\`${role.members.size}\``, true)
      .addField('Hoisted', `\`${role.hoist}\``, true)
      .addField('Created On', `\`${moment(role.createdAt).format('MMM DD YYYY')}\``, true)
      .addField('Permissions', `\`\`\`diff\n${finalPermissions.join('\n')}\`\`\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(role.hexColor);
    message.channel.send(embed);
  }
};
