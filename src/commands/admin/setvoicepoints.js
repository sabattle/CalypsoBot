const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetVoicePointsVoice extends Command {
  constructor(client) {
    super(client, {
      name: 'setvoicepoints',
      aliases: ['setvp', 'svp'],
      usage: 'setvoicepoints <point count>',
      description: 'Sets the amount of points earned per minute spent in voice chat.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setvoicepoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please enter a positive integer.');
    const voicePoints = message.client.db.settings.selectVoicePoints.pluck().get(message.guild.id);
    message.client.db.settings.updateVoicePoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `voice points` value was successfully updated.')
      .addField('Setting', 'Voice Points', true)
      .addField('Current Value', `\`${voicePoints}\` ➔ \`${amount}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
