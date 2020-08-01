const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownChannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownchannel',
      aliases: ['setcc', 'scc'],
      usage: 'setcrownchannel <channel mention/ID>',
      description: oneLine`
        Sets the crown message text channel for your server. 
        Provide no channel to clear the current crown channel.
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
    let status = (crownRoleId && crownSchedule) ? '`enabled`' : '`disabled`';
    const crownRole = message.guild.roles.cache.find(r => r.id === crownRoleId);
    const oldCrownChannel = message.guild.channels.cache.get(crownChannelId) || '`None`';
    
    // Trim message
    if (crownMessage) {
      if (crownMessage.length >= 1018) crownMessage = crownMessage.slice(0, 1015) + '...';
      crownMessage = `\`\`\`${crownMessage}\`\`\``;
    }

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `crown role` was successfully updated. <:success:736449240728993802>')
      .addField('Role', crownRole || '`None`', true)
      .addField('Schedule', `\`${(crownSchedule) ? crownSchedule : 'None'}\``, true)
      .addField('Status', status)
      .addField('Message', crownMessage || '`None`')
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

    const channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel || channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, `
      Invalid argument. Please mention an accessible text channel or provide a valid channel ID.
    `);

    message.client.db.settings.updateCrownChannelId.run(channel.id, message.guild.id);
    message.channel.send(embed.spliceFields(1, 0, { 
      name: 'Channel', 
      value: `${oldCrownChannel} ➔ ${channel}`, 
      inline: true 
    }));
  }
};
