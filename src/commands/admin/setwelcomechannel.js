const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetWelcomeChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setwelcomechannel',
      aliases: ['setwc', 'swc'],
      usage: 'setwelcomechannel <channel mention/ID>',
      description: oneLine`
        Sets the welcome message text channel for your server. 
        Provide no channel to clear the current welcome channel.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomechannel #general']
    });
  }
  run(message, args) {

    let { welcome_channel_id: welcomeChannelId, welcome_message: welcomeMessage } = 
      message.client.db.settings.selectWelcomeMessages.get(message.guild.id);
    const oldWelcomeChannel = message.guild.channels.cache.get(welcomeChannelId) || '`None`';
    let status, oldStatus = (welcomeChannelId && welcomeMessage) ? '`enabled`' : '`disabled`';

    // Trim message
    if (welcomeMessage.length >= 1018) welcomeMessage = welcomeMessage.slice(0, 1015) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcome Messages`')
      .setDescription('The `welcome channel` was successfully updated. <:success:736449240728993802>')
      .addField('Message', `\`\`\`${welcomeMessage}\`\`\`` || '`None`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateWelcomeChannelId.run(null, message.guild.id);

      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';
      
      return message.channel.send(embed
        .spliceFields(0, 0, { name: 'Channel', value: `${oldWelcomeChannel} ➔ \`None\``, inline: true })
        .spliceFields(1, 0, { name: 'Status', value: status, inline: true })
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);

    // Check status
    if (oldStatus != '`enabled`' && channel && welcomeMessage) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.client.db.settings.updateWelcomeChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .spliceFields(0, 0, { name: 'Channel', value: `${oldWelcomeChannel} ➔ ${channel}`, inline: true})
      .spliceFields(1, 0, { name: 'Status', value: status, inline: true})
    );
  }
};
