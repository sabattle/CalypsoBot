const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const parser = require('cron-parser');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetCrownScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownschedule',
      aliases: ['setcs', 'scs'],
      usage: 'setcrownschedule <cron>',
      description: stripIndent`
        Sets the schedule for Calypso's crown role rotation. 
        The format is cron-style:
        \`\`\`*    *    *    *    *
        ┬    ┬    ┬    ┬    ┬
        │    │    │    │    │
        │    │    │    │    └ day of week (0 - 7)
        │    │    │    └───── month (1 - 12)
        │    │    └────────── day of month (1 - 31)
        │    └─────────────── hour (0 - 23)
        └──────────────────── minute (0 - 59)\`\`\`
        If you wish to use multiple values for any of the categories, please separate them with \`,\`.` +
        ' Step syntax is also supported, for example: `*/30 * * * *` (every 30 minutes). ' +
        'For the day of the week, both 0 and 7 may represent Sunday. ' +
        'If you need additional help building your cron, please check out this website: <https://crontab.guru/#>. ' + 
        `Enter no schedule to clear the current crown schedule.
        **Please Note:** Not all months have the same amount of days.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownschedule 0 21 * * 3,6', 'setcrownschedule * 0 12 /10 * *']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: oldCrownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    let status, oldStatus = (crownRoleId && oldCrownSchedule) ? '`enabled`' : '`disabled`';
    const crownRole = message.guild.roles.cache.find(r => r.id === crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    // Trim message
    if (crownMessage) crownMessage = `\`\`\`${crownMessage.slice(0, 1015) + '...'}\`\`\``;
    else crownMessage = '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription('The `crown schedule` was successfully updated. <:success:736449240728993802>')
      .addField('Role', crownRole || '`None`', true)
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Message', crownMessage)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear schedule
    if (!message.content.includes(' ')) {
      message.client.db.settings.updateCrownSchedule.run(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); // Cancel old job
      
      // Check status
      if (oldStatus != '`disabled`') status = '`enabled` ➔ `disabled`'; 
      else status = '`disabled`';
      
      return message.channel.send(embed
        .spliceFields(2, 0, { name: 'Schedule', value: `\`${oldCrownSchedule || 'None'}\` ➔ \`None\``, inline: true })
        .spliceFields(3, 0, { name: 'Status', value: status })
      );
    }

    const crownSchedule = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    try {
      parser.parseExpression(crownSchedule);
    } catch (err) {
      return this.sendErrorMessage(message, oneLine`
        Invalid argument. Please try again with a valid cron expression. 
        If you need additional help building your cron, please check out this website: <https://crontab.guru/#>
      `);
    }

    message.client.db.settings.updateCrownSchedule.run(crownSchedule, message.guild.id);
    if (message.guild.job) message.guild.job.cancel(); // Cancel old job

    // Schedule crown role rotation
    message.client.utils.scheduleCrown(message.client, message.guild);

    // Check status
    if (oldStatus != '`enabled`' && crownRoleId && crownSchedule) status =  '`disabled` ➔ `enabled`';
    else status = oldStatus;

    message.channel.send(embed
      .spliceFields(2, 0, { 
        name: 'Schedule', 
        value: `\`${oldCrownSchedule || 'None'}\` ➔ \`${crownSchedule}\``, 
        inline: true 
      })
      .spliceFields(3, 0, { name: 'Status', value: status })
    );
  }
};
