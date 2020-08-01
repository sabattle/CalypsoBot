const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: 'setcommandpoints <point count>',
      description: 'Sets the amount of points earned per Calypso command used.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcommandpoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please enter a positive integer.');
    const { 
      point_tracking: pointTracking, 
      message_points: messagePoints, 
      command_points: commandPoints,
      voice_points: voicePoints 
    } = message.client.db.settings.selectPoints.get(message.guild.id);
    const status = (pointTracking) ? '`enabled`' : '`disabled`';
    message.client.db.settings.updateCommandPoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Setting: `Points System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `command points` value was successfully updated. <:success:736449240728993802>')
      .addField('Message Points', `\`${messagePoints}\``, true)
      .addField('Command Points', `\`${commandPoints}\` ➔ \`${amount}\``, true)
      .addField('Voice Points', `\`${voicePoints}\``, true)
      .addField('Status', status)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
