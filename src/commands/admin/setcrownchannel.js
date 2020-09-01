const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetCrownChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownchannel',
      aliases: ['setcc', 'scc'],
      usage: 'setcrownchannel <channel mention/ID>',
      description: oneLine`
        Sets the crown message text channel for your server. 
        Provide no channel to clear the current \`crown channel\`.
        A \`crown message\` will only be sent if a \`crown channel\`, \`crown role\`, and \`crown schedule\` are set.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownchannel #general']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: crownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const oldCrownChannel = message.guild.channels.cache.get(crownChannelId) || '`None`';

    // Get status
    const status = message.client.utils.getStatus(crownRoleId, crownSchedule);
    
    // Trim message
    if (crownMessage && crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`crown role\` was successfully updated. ${success}`)
      .addField('Role', crownRole || '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', `\`${status}\``)
      .addField('Message', message.client.utils.replaceCrownKeywords(crownMessage) || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear channel
    if (args.length === 0) {
      message.client.db.settings.updateCrownChannelId.run(null, message.guild.id);
      return message.channel.send(embed.spliceFields(1, 0, { 
        name: 'Channel', 
        value: `${oldCrownChannel} ➔ \`None\``, 
        inline: true
      }));
    }

    const crownChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!crownChannel || (crownChannel.type != 'text' && crownChannel.type != 'news') || !crownChannel.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);

    message.client.db.settings.updateCrownChannelId.run(crownChannel.id, message.guild.id);
    message.channel.send(embed.spliceFields(1, 0, { 
      name: 'Channel', 
      value: `${oldCrownChannel} ➔ ${crownChannel}`, 
      inline: true 
    }));
  }
};
