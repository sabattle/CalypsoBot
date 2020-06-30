const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: 'setcommandpoints <point count>',
      description: 'Sets amount of points earned per command used.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcommandpoints 5']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return this.sendErrorMessage(message, 'Invalid argument. Please enter a positive integer.');
    const commandPoints = message.client.db.guildSettings.selectCommandPoints.pluck().get(message.guild.id);
    message.client.db.guildSettings.updateCommandPoints.run(amount, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .addField('Setting', '**Command Points**', true)
      .addField('Current Value', `\`${commandPoints}\` 🡪 \`${amount}\``, true)
      .setThumbnail(message.guild.iconURL())
      .setFooter(`
        Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
