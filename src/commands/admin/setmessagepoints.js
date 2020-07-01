const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetMessagePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessagepoints',
      aliases: ['setmp', 'smp'],
      usage: 'setmessagepoints <point count>',
      description: 'Sets the amount of points earned per user message.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmessagepoints 1']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please enter a positive integer.');
    const messagePoints = message.client.db.guildSettings.selectMessagePoints.pluck().get(message.guild.id);
    message.client.db.guildSettings.updateMessagePoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .addField('Setting', '**Message Points**', true)
      .addField('Current Value', `\`${messagePoints}\` 🡪 \`${amount}\``, true)
      .setThumbnail(message.guild.iconURL())
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
