const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetDefaultChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setdefaultchannel',
      aliases: ['setdc', 'sdc'],
      usage: 'setdefaultchannel <channel mention>',
      description: oneLine`
        Sets the default text channel for your server. 
        Provide no channel to clear the current default channel.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setdefaultchannel #general']
    });
  }
  run(message, args) {
    const defaultChannelId = message.client.db.guildSettings.selectDefaultChannelId.pluck().get(message.guild.id);
    let oldDefaultChannel = '`None`';
    if (defaultChannelId) oldDefaultChannel = message.guild.channels.cache.get(defaultChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL())
      .addField('Setting', '**Default Channel**', true)
      .setFooter(`Requested by ${message.member.displayName}#${message.author.discriminator}`, 
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateDefaultChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldDefaultChannel} 🡪 \`None\``, true));
    }

    const channel = this.getChannelFromMention(message, args[0]);
    if (!channel) return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel.');
    message.client.db.guildSettings.updateDefaultChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldDefaultChannel} 🡪 ${channel}`, true));
  }
};
