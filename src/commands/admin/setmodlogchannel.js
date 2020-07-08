const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetModlogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodlogchannel',
      aliases: ['setmlc', 'smlc'],
      usage: 'setmodlogchannel <channel mention/ID>',
      description: oneLine`
        Sets the modlog text channel for your server. 
        Provide no channel to clear the current modlog channel.
      `,
      type: types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodlogchannel #modlog']
    });
  }
  run(message, args) {
    const modlogChannelId = message.client.db.settings.selectModlogChannelId.pluck().get(message.guild.id);
    let oldModlogChannel = '`None`';
    if (modlogChannelId) oldModlogChannel = message.guild.channels.cache.get(modlogChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Modlog Channel', true)
      .setDescription('The `modlog channel` was successfully updated.')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModlogChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldModlogChannel} ➔ \`None\``, true));
    }

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) 
      return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel or provide a channel ID.');
    message.client.db.settings.updateModlogChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldModlogChannel} ➔ ${channel}`, true));
  }
};
