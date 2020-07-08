const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetMessagePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessagepoints',
      aliases: ['setmp', 'smp'],
      usage: 'setmessagepoints <point count>',
      description: 'Sets the amount of points earned per user message.',
      type: types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmessagepoints 1']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please enter a positive integer.');
    const messagePoints = message.client.db.settings.selectMessagePoints.pluck().get(message.guild.id);
    message.client.db.settings.updateMessagePoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `message points` value was successfully updated.')
      .addField('Setting', 'Message Points', true)
      .addField('Current Value', `\`${messagePoints}\` ➔ \`${amount}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
