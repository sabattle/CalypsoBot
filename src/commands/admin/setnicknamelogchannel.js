const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetNicknameLogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setnicknamelogchannel',
      aliases: ['setnicknamelog', 'setnnlc', 'snnlc'],
      usage: 'setnicknamelogchannel <channel mention/ID>',
      description: oneLine`
        Sets the nickname change log text channel for your server. 
        Provide no channel to clear the current \`nickname log channel\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setnicknamelog #botlog']
    });
  }
  run(message, args) {
    const nicknameLogChannelId = message.client.db.settings.selectNicknameLogChannelId.pluck().get(message.guild.id);
    const oldNicknameLogChannel = message.guild.channels.cache.get(nicknameLogChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`nickname log channel\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateNicknameLogChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Nickname Log', `${oldNicknameLogChannel} ➔ \`None\``));
    }

    const nicknameLogChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!nicknameLogChannel || nicknameLogChannel.type != 'text' || !nicknameLogChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    message.client.db.settings.updateNicknameLogChannelId.run(nicknameLogChannel.id, message.guild.id);
    message.channel.send(embed.addField('Nickname Log', `${oldNicknameLogChannel} ➔ ${nicknameLogChannel}`));
  }
};
