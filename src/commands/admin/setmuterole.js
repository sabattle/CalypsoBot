const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

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
    const oldMuteRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mute role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ \`None\``));
    }

    // Update role
    const muteRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!muteRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    message.client.db.settings.updateMuteRoleId.run(muteRole.id, message.guild.id);
    message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ ${muteRole}`));
  }
};
