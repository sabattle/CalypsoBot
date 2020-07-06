const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Sets the command prefix for your server. The max prefix length is 3 characters.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix !']
    });
  }
  run(message, args) {
    const oldPrefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 'Invalid argument. Please specify a prefix.');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(
        message, 'Invalid argument. Please ensure the prefix is no larger than 3 characters.'
      );
    message.client.db.settings.updatePrefix.run(prefix, message.guild.id);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `prefix` was successfully updated.')
      .addField('Setting', 'Prefix', true)
      .addField('Current Value', `\`${oldPrefix}\` ➔ \`${prefix}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
