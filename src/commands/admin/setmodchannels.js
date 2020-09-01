const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetModChannelsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodchannels',
      aliases: ['setmodcs', 'setmcs', 'smcs'],
      usage: 'setmodchannels <channel mentions/IDs>',
      description: oneLine`
        Sets the moderator only text channels for your server.
        Only \`${client.utils.capitalize(client.types.MOD)}\` type commands will work in these channels,
        and Calypso will only respond to members with permission to use those commands.
        Provide no channels to clear the current \`mod channels\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodchannels #general #memes #off-topic']
    });
  }
  run(message, args) {
    const { trimArray  } = message.client.utils;
    const modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id);
    let oldModChannels = [];
    if (modChannelIds) {
      for (const channel of modChannelIds.split(' ')) {
        oldModChannels.push(message.guild.channels.cache.get(channel));
      }
      oldModChannels = trimArray(oldModChannels).join(' ');
    }
    if (oldModChannels.length === 0) oldModChannels = '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mod channels\` were successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModChannelIds.run(null, message.guild.id);
      return message.channel.send(embed.addField('Mod Channels', `${oldModChannels} ➔ \`None\``));
    }

    let channels = [];
    for (const arg of args) {
      const channel = this.getChannelFromMention(message, arg) || message.guild.channels.cache.get(arg);
      if (channel && channel.type === 'text' && channel.viewable) channels.push(channel);
      else return this.sendErrorMessage(message, 0, stripIndent`
        Please mention only accessible text channels or provide only valid text channel IDs
      `);
    }
    channels = [...new Set(channels)];
    const channelIds = channels.map(c => c.id).join(' '); // Only keep unique IDs
    message.client.db.settings.updateModChannelIds.run(channelIds, message.guild.id);
    message.channel.send(embed.addField('Mod Channels', `${oldModChannels} ➔ ${trimArray(channels).join(' ')}`));
  }
};
