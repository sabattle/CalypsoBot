const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownchannel',
      aliases: ['setcc', 'scc'],
      usage: 'setcrownchannel <channel mention/ID>',
      description: oneLine`
        Sets the crown message text channel for your server. 
        Provide no channel to clear the current crown channel.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownchannel #general']
    });
  }
  run(message, args) {
    const crownChannelId = message.client.db.settings.selectCrownChannelId.pluck().get(message.guild.id);
    let oldCrownChannel = '`None`';
    if (crownChannelId) oldCrownChannel = message.guild.channels.cache.get(crownChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Crown Channel', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateCrownChannelId.run(null, message.guild.id);
      return message.channel.send(embed
        .setDescription('The `crown channel` was successfully updated.')
        .addField('Current Value', `${oldCrownChannel} ➔ \`None\``, true)
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);
    message.client.db.settings.updateCrownChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .setDescription(oneLine`
        The \`crown channel\` was successfully updated.
        Please note that a \`crown role\`, \`crown message\`, and \`crown schedule\` must also be set.
      `)
      .addField('Current Value', `${oldCrownChannel} ➔ ${channel}`, true)
    );
  }
};
