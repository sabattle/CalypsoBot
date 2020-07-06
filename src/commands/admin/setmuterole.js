const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['setmur', 'smur'],
      usage: 'setmuterole <role mention | role name>',
      description: 'Sets the mute role your server. Provide no role to clear the current mute role.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmuterole @Muted']
    });
  }
  run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `mute role` was successfully updated.')
      .addField('Setting', 'Mute Role', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldRole} ➔ \`None\``, true));
    }

    // Update role
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role name.');
    message.client.db.settings.updateMuteRoleId.run(role.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldRole} ➔ ${role}`, true));
  }
};
