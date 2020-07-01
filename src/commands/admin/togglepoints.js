const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglepoints',
      aliases: ['togglep'],
      usage: 'togglepoints',
      description: 'Enables or disables Calypso\'s point tracking.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let pointsEnabled = message.client.db.guildSettings.selectPointsEnabled.pluck().get(message.guild.id);
    pointsEnabled = 1 - pointsEnabled; // Invert
    message.client.db.guildSettings.updatePointsEnabled.run(pointsEnabled, message.guild.id);
    const status = (pointsEnabled == 1) ? '`disabled`	🡪 `enabled`' : '`enabled` 🡪 `disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', '**Points**', true)
      .addField('Current Status', status, true)
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
