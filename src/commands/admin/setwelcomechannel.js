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
      type: types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setwelcomechannel #general']
    });
  }
  run(message, args) {
    const welcomeChannelId = message.client.db.settings.selectWelcomeChannelId.pluck().get(message.guild.id);
    let oldWelcomeChannel = '`None`';
    if (welcomeChannelId) oldWelcomeChannel = message.guild.channels.cache.get(welcomeChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Welcome Channel', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateWelcomeChannelId.run(null, message.guild.id);
      return message.channel.send(embed
        .setDescription('The `welcome channel` was successfully updated.')
        .addField('Current Value', `${oldWelcomeChannel} ➔ \`None\``, true)
      );
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) 
      return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel or provide a channel ID.');
    message.client.db.settings.updateWelcomeChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed
      .setDescription(oneLine`
        The \`welcome channel\` was successfully updated. Please note that a \`welcome message\` must also be set.
      `)
      .addField('Current Value', `${oldWelcomeChannel} ➔ ${channel}`, true)
    );
  }
};
