const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetAdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setadminrole',
      aliases: ['setar', 'sar'],
      usage: 'setadminrole <role mention/ID>',
      description: 'Sets the admin role for your server. Provide no role to clear the current admin role.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setadminrole @Admin']
    });
  }
  run(message, args) {
    const adminRoleId = message.client.db.settings.selectAdminRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === adminRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Setting: `Admin Role`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `admin role` was successfully updated. <:success:736449240728993802>')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateAdminRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Role', `${oldRole} ➔ \`None\``));
    }

    // Update role
    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateAdminRoleId.run(role.id, message.guild.id);
    message.channel.send(embed.addField('Role', `${oldRole} ➔ ${role}`));
  }
};
