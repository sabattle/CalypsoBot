const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetModLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodlog',
      aliases: ['setml', 'sml'],
      usage: 'setmodlog <channel mention/ID>',
      description: oneLine`
        Sets the mod log text channel for your server. 
        Provide no channel to clear the current \`mod log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setmodlog #mod-log']
    });
  }
  run(message, args) {
    const modLogId = message.client.db.settings.selectModLogId.pluck().get(message.guild.id);
    const oldModLog = message.guild.channels.cache.get(modLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mod log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.settings.updateModLogId.run(null, message.guild.id);
      return message.channel.send(embed.addField('Mod Log', `${oldModLog} ➔ \`None\``));
    }

    const modLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!modLog || modLog.type != 'text' || !modLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    message.client.db.settings.updateModLogId.run(modLog.id, message.guild.id);
    message.channel.send(embed.addField('Mod Log', `${oldModLog} ➔ ${modLog}`));
  }
};
