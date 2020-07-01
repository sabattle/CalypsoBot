const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: 'setmodrole <role mention | role name>',
      description: 'Sets the mod role for your server. Provide no role to clear the current mod role.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodrole @Mod']
    });
  }
  run(message, args) {
    const modRoleId = message.client.db.guildSettings.selectModRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', '**Mod Role**', true)
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldRole} 🡪 \`None\``, true));
    }

    // Update role
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role name.');
    message.client.db.guildSettings.updateModRoleId.run(role.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldRole} 🡪 ${role}`, true));
  }
};
