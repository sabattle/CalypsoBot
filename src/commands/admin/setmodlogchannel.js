const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetModlogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodlogchannel',
      aliases: ['setmlc', 'smlc'],
      usage: 'setmodlogchannel <channel mention>',
      description: oneLine`
        Sets the modlog text channel for your server. 
        Provide no channel to clear the current modlog channel.
      `,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodlogchannel #mod-log']
    });
  }
  run(message, args) {
    const modlogChannelId = message.client.db.guildSettings.selectModlogChannelId.pluck().get(message.guild.id);
    let oldModlogChannel = '`None`';
    if (modlogChannelId) oldModlogChannel = message.guild.channels.cache.get(modlogChannelId);
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', '**Modlog Channel**', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateModlogChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Current Value', `${oldModlogChannel} ➔ \`None\``, true));
    }

    const channel = this.getChannelFromMention(message, args[0]);
    if (!channel) return this.sendErrorMessage(message, 'Invalid argument. Please mention a text channel.');
    message.client.db.guildSettings.updateModlogChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.addField('Current Value', `${oldModlogChannel} ➔ ${channel}`, true));
  }
};
