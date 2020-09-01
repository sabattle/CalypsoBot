const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetAutoRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautorole',
      aliases: ['setaur', 'saur'],
      usage: 'setautorole <role mention/ID>',
      description: oneLine`
        Sets the role all new members will receive upon joining your server.
        Provide no role to clear the current \`auto role\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setautorole @Member']
    });
  }
  run(message, args) {
    const autoRoleId = message.client.db.settings.selectAutoRoleId.pluck().get(message.guild.id);
    const oldAutoRole = message.guild.roles.cache.find(r => r.id === autoRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`auto role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateAutoRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Auto Role', `${oldAutoRole} ➔ \`None\``));
    }

    // Update role
    const autoRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!autoRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    message.client.db.settings.updateAutoRoleId.run(autoRole.id, message.guild.id);
    message.channel.send(embed.addField('Auto Role', `${oldAutoRole} ➔ ${autoRole}`));
  }
};
