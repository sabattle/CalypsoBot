const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class ToggleRandomColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglerandomcolor',
      aliases: ['togglerc', 'trc'],
      usage: 'togglerandomcolor',
      description: 'Enables or disables automatic random color role assigning when someone joins your server.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let randomColorEnabled = message.client.db.settings.selectRandomColorEnabled.pluck().get(message.guild.id);
    randomColorEnabled = 1 - randomColorEnabled; // Invert
    message.client.db.settings.updateRandomColorEnabled.run(randomColorEnabled, message.guild.id);
    const status = (randomColorEnabled == 1) ? '`disabled`	🡪 `enabled`' : '`enabled` 🡪 `disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', 'Auto Random Color', true)
      .addField('Current Status', status, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};