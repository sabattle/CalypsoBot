const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: 'setmodrole <role mention/ID>',
      description: 'Sets the mod role for your server. Provide no role to clear the current mod role.',
      type: types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodrole @Mod']
    });
  }
  run(message, args) {
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `mod role` was successfully updated.')
      .addField('Setting', 'Mod Role', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldRole} ➔ \`None\``, true));
    }

    // Update role
    const role = this.getRoleFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateModRoleId.run(role.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldRole} ➔ ${role}`, true));
  }
};
