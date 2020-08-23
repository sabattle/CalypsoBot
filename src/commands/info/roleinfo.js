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

    const rolePermissions = role.permissions.toArray().sort((a, b) => {
      return Object.keys(permissions).indexOf(a) - Object.keys(permissions).indexOf(b);
    }).map(p => '`' + permissions[p] + '`');

    // Reverse role position
    const position = `\`${message.guild.roles.cache.size - role.position}\`/\`${message.guild.roles.cache.size}\``;

    const embed = new MessageEmbed()
      .setTitle('Role Information')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Role', role, true)
      .addField('Role ID', `\`${role.id}\``, true)
      .addField('Position', position, true)
      .addField('Hoisted', `\`${role.hoist}\``, true)
      .addField('Color', `\`${role.hexColor.toUpperCase()}\``, true)
      .addField('Members', `\`${role.members.size}\``, true)
      .addField('Mentionable', `\`${role.mentionable}\``, true)
      .addField('Created On', moment(role.createdAt).format('MMM DD YYYY'), true)
      .addField('Permissions', (rolePermissions.length > 0) ? rolePermissions.join(' ') : '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(role.hexColor);
    message.channel.send(embed);
  }
};
