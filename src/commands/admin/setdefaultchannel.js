const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetDefaultChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setdefaultchannel',
      aliases: ['setdc', 'sdc'],
      usage: 'setdefaultchannel <channel mention/ID>',
      description: oneLine`
        Sets the default text channel for your server, where Calypso's system messages will be sent. 
        Provide no channel to clear the current default channel.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setdefaultchannel #general']
    });
  }
  run(message, args) {
    const defaultChannelId = message.client.db.settings.selectDefaultChannelId.pluck().get(message.guild.id);
    let oldDefaultChannel = '`None`';
    if (defaultChannelId) oldDefaultChannel = message.guild.channels.cache.get(defaultChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `default channel` was successfully updated.')
      .addField('Setting', 'Default Channel', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateDefaultChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldDefaultChannel} ➔ \`None\``, true));
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) 
      return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel or provide a channel ID.');
    message.client.db.settings.updateDefaultChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldDefaultChannel} ➔ ${channel}`, true));
  }
};
