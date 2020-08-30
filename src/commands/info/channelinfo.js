const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { voice } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const channelTypes = {
  dm: 'DM',
  text: 'Text',
  voice: 'Voice',
  category: 'Category',
  news: 'News',
  store: 'Store'
};

module.exports = class ChannelInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'channelinfo',
      aliases: ['channel', 'ci'],
      usage: 'channelinfo [channel mention/ID]',
      description: oneLine`
        Fetches information about the provided channel. 
        If no channel is given, the current channel will be used.
      `,
      type: client.types.INFO,
      examples: ['channelinfo #general']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const embed = new MessageEmbed()
      .setTitle('Channel Information')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Channel', channel, true)
      .addField('ID', `\`${channel.id}\``, true)
      .addField('Type', `\`${channelTypes[channel.type]}\``, true)
      .addField('Members', `\`${channel.members.size}\``, true)
      .addField('Bots', `\`${channel.members.array().filter(b => b.user.bot).length}\``, true)
      .addField('Created On', `\`${moment(channel.createdAt).format('MMM DD YYYY')}\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (channel.type === 'text') {
      embed // Text embed
        .spliceFields(3, 0, { name: 'Rate Limit', value: `\`${channel.rateLimitPerUser}\``, inline: true })
        .spliceFields(6, 0, { name: 'NSFW', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === 'news') {
      embed // News embed
        .spliceFields(6, 0, { name: 'NSFW', value: `\`${channel.nsfw}\``, inline: true });
    } else if (channel.type === 'voice') {
      embed // Voice embed
        .spliceFields(0, 1, { name: 'Channel', value: `${voice} ${channel.name}`, inline: true })
        .spliceFields(5, 0, { name: 'User Limit', value: `\`${channel.userLimit}\``, inline: true })
        .spliceFields(6, 0, { name: 'Full', value: `\`${channel.full}\``, inline: true });
      const members = channel.members.array();
      if (members.length > 0) 
        embed.addField('Members Joined', message.client.utils.trimArray(channel.members.array()).join(' '));
    } else return this.sendErrorMessage(message, 0, stripIndent`
      Please enter mention a valid text or announcement channel` +
      ' or provide a valid text, announcement, or voice channel ID'
    );
    if (channel.topic) embed.addField('Topic', channel.topic);
    message.channel.send(embed);
  }
};
