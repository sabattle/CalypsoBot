const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      aliases: ['setmr', 'smr'],
      usage: 'setmodrole <role mention/ID>',
      description: 'Sets the `mod role` for your server. Provide no role to clear the current `mod role`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodrole @Mod']
    });
  }
  run(message, args) {
    const modRoleId = message.client.db.settings.selectModRoleId.pluck().get(message.guild.id);
    const oldModRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mod role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Mod Role', `${oldModRole} ➔ \`None\``));
    }

    // Update role
    const modRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!modRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    message.client.db.settings.updateModRoleId.run(modRole.id, message.guild.id);
    message.channel.send(embed.addField('Mod Role', `${oldModRole} ➔ ${modRole}`));
  }
};
