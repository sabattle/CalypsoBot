const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetWelcomeChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomechannel',
      aliases: ['setwc', 'swc'],
      usage: 'setwelcomechannel <channel mention/ID>',
      description: oneLine`
        Sets the welcome message text channel for your server. 
        Provide no channel to clear the current \`welcome channel\`.
        A \`welcome message\` must also be set to enable welcome messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomechannel #general']
    });
  }
  run(message, args) {

    let { welcome_channel_id: welcomeChannelId, welcome_message: welcomeMessage } = 
      message.client.db.settings.selectWelcomes.get(message.guild.id);
    const oldWelcomeChannel = message.guild.channels.cache.get(welcomeChannelId) || '`None`';

    // Get status
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, welcomeMessage);

    // Trim message
    if (welcomeMessage && welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcomes`')
      .setDescription(`The \`welcome channel\` was successfully updated. ${success}`)
      .addField('Message', message.client.utils.replaceKeywords(welcomeMessage) || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateWelcomeChannelId.run(null, message.guild.id);

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Channel', value: `${oldWelcomeChannel} ➔ \`None\``, inline: true })
        .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true })
      );
    }

    const welcomeChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!welcomeChannel || (welcomeChannel.type != 'text' && welcomeChannel.type != 'news') || !welcomeChannel.viewable)
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);

    // Update status
    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.client.db.settings.updateWelcomeChannelId.run(welcomeChannel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Channel', value: `${oldWelcomeChannel} ➔ ${welcomeChannel}`, inline: true})
      .spliceFields(1, 0, { name: 'Status', value: statusUpdate, inline: true})
    );
  }
};
