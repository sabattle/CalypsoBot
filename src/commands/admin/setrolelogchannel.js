const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetRoleLogChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setrolelogchannel',
      aliases: ['setrolelog', 'setrlc', 'srlc'],
      usage: 'setrolelogchannel <channel mention/ID>',
      description: oneLine`
        Sets the role change log text channel for your server. 
        Provide no channel to clear the current \`role log channel\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setrolelog #botlog']
    });
  }
  run(message, args) {
    const roleLogChannelId = message.client.db.settings.selectRoleLogChannelId.pluck().get(message.guild.id);
    const oldRoleLogChannel = message.guild.channels.cache.get(roleLogChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`role log channel\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateRoleLogChannelId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Role Log', `${oldRoleLogChannel} ➔ \`None\``));
    }

    const roleLogChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!roleLogChannel || roleLogChannel.type != 'text' || !roleLogChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    message.client.db.settings.updateRoleLogChannelId.run(roleLogChannel.id, message.guild.id);
    message.channel.send(embed.addField('Role Log', `${oldRoleLogChannel} ➔ ${roleLogChannel}`));
  }
};
