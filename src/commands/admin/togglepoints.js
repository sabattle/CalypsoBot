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
    let pointsEnabled = message.client.db.guildSettings.selectPointsEnabled.pluck().get(message.guild.id); // Get prefix
    pointsEnabled = 1 - pointsEnabled; // Invert
    message.client.db.guildSettings.updatePointsEnabled.run(pointsEnabled, message.guild.id);
    let status;
    if (pointsEnabled == 1) status = '`disabled`	🡪 `enabled`';
    else status = '`enabled` 🡪 `disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .addField('Setting', '**Points**', true)
      .addField('Current Status', status, true)
      .setThumbnail(message.guild.iconURL())
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
