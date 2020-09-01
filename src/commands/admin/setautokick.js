const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');

module.exports = class SetAutoKickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautokick',
      aliases: ['setak', 'sak'],
      usage: 'setautokick <warn count>',
      description: oneLine`
        Sets the amount of warns needed before Calypso will automatically kick someone from your server.
        Provide no warn count or a warn count of 0 to disable \`auto kick\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setautokick 3']
    });
  }
  run(message, args) {

    const autoKick = message.client.db.settings.selectAutoKick.pluck().get(message.guild.id) || 'disabled';
    const amount = args[0];
    if (amount && (!Number.isInteger(Number(amount)) || amount < 0)) 
      return this.sendErrorMessage(message, 0, 'Please enter a positive integer');
      
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`Auto kick\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0 || amount == 0) {
      message.client.db.settings.updateAutoKick.run(null, message.guild.id);
      return message.channel.send(embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`disabled\``));
    }

    message.client.db.settings.updateAutoKick.run(amount, message.guild.id);
    message.channel.send(embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`${amount}\``));
  }
};
