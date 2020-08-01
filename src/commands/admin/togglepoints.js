const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class TogglePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'togglepoints',
      aliases: ['togglep', 'togp'],
      usage: 'togglepoints',
      description: 'Enables or disables Calypso\'s point tracking.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    let { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    pointTracking = 1 - pointTracking; // Invert
    message.client.db.settings.updatePointTracking.run(pointTracking, message.guild.id);

    let description, status;
    if (pointTracking == 1) {
      status = '`disabled`	🡪 `enabled`';
      description = '`Points` have been successfully **enabled**. <:success:736449240728993802>';
    } else {
      status = '`enabled` 🡪 `disabled`';
      description = '`Points` have been successfully **disabled**. <:fail:736449226120233031>';   
    } 
    
    const embed = new MessageEmbed()
      .setTitle('Setting: `Points System`')
      .setThumbnail(message.guild.iconURL())
      .setDescription(description)
      .addField('Message Points', `\`${messagePoints}\``, true)
      .addField('Command Points', `\`${commandPoints}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', status, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};