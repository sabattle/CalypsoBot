const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['setmur', 'smur'],
      usage: 'setmuterole <role mention/ID>',
      description: 'Sets the `mute role` your server. Provide no role to clear the current `mute role`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmuterole @Muted']
    });
  }
  run(message, args) {
    const muteRoleId = message.client.db.settings.selectMuteRoleId.pluck().get(message.guild.id);
    let oldRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Mute Role`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `mute role` was successfully updated. <:success:736449240728993802>')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Role', `${oldRole} ➔ \`None\``));
    }

    // Update role
    const role = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!role) return this.sendErrorMessage(message, 'Invalid argument. Please mention a role or provide a role ID.');
    message.client.db.settings.updateMuteRoleId.run(role.id, message.guild.id);
    message.channel.send(embed.addField('Role', `${oldRole} ➔ ${role}`));
  }
};
