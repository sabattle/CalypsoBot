const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const parser = require('cron-parser');
const { success } = require('../../utils/emojis.json');
const { stripIndent } = require('common-tags');

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
        ' Step syntax is also supported, for example: `0 */1 * * *` (every hour). ' +
        'For the day of the week, both 0 and 7 may represent Sunday. ' +
        'If you need additional help building your cron, please check out this website: <https://crontab.guru/#>. ' + 
        `Enter no schedule to clear the current \`crown schedule\`.
        A \`crown role\` must also be set to enable role rotation.
        **Please Note:** To prevent potential Discord API abuse, minutes and seconds will always be set to \`0\`.`,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownschedule 0 21 * * 3,6', 'setcrownschedule 0 0 15 * *']
    });
  }
  run(message, args) {
    let { 
      crown_role_id: crownRoleId, 
      crown_channel_id: crownChannelId, 
      crown_message: crownMessage, 
      crown_schedule: oldCrownSchedule 
    } = message.client.db.settings.selectCrown.get(message.guild.id);
    const crownRole = message.guild.roles.cache.get(crownRoleId);
    const crownChannel = message.guild.channels.cache.get(crownChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(crownRoleId, oldCrownSchedule);

    // Trim message
    if (crownMessage && crownMessage.length > 1024) crownMessage = crownMessage.slice(0, 1021) + '...';

    let description = `The \`crown schedule\` was successfully updated. ${success}`;
    const embed = new MessageEmbed()
      .setTitle('Settings: `Crown`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Role', crownRole || '`None`', true)
      .addField('Channel', crownChannel || '`None`', true)
      .addField('Message', message.client.utils.replaceCrownKeywords(crownMessage) || '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear schedule
    if (!message.content.includes(' ')) {
      message.client.db.settings.updateCrownSchedule.run(null, message.guild.id);
      if (message.guild.job) message.guild.job.cancel(); // Cancel old job

      message.client.logger.info(`${message.guild.name}: Cancelled job`);
      
      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 
      
      return message.channel.send(embed
        .spliceFields(2, 0, { name: 'Schedule', value: `\`${oldCrownSchedule || 'None'}\` ➔ \`None\``, inline: true })
        .spliceFields(3, 0, { name: 'Status', value: statusUpdate })
      );
    }

    let crownSchedule = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    try {
      parser.parseExpression(crownSchedule);
    } catch (err) {
      return this.sendErrorMessage(message, 0, 'Please try again with a valid cron expression');
    }

    // Set minutes and seconds to 0
    const cron = crownSchedule.split(' ');
    if (cron[0] != '0') {
      description = description + `\n**Note:** Minutes were changed from \`${cron[0]}\` to \`0\`.`;
      cron[0] = '0';
    }
    if (cron.length === 6 && cron[5] != '0') {
      if (description.includes('\n'))
        description = description.slice(0, -1) + `, and seconds were changed from \`${cron[5]}\` to \`0\`.`;
      else description = description + `\n**Note:** Seconds were changed from \`${cron[5]}\` to \`0\`.`;
      cron[5] = '0';
    } 
    crownSchedule = cron.join(' ');
    embed.setDescription(description);

    message.client.db.settings.updateCrownSchedule.run(crownSchedule, message.guild.id);
    if (message.guild.job) message.guild.job.cancel(); // Cancel old job

    // Schedule crown role rotation
    message.client.utils.scheduleCrown(message.client, message.guild);

    // Update status
    const status =  message.client.utils.getStatus(crownRole, crownSchedule);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .spliceFields(2, 0, { 
        name: 'Schedule', 
        value: `\`${oldCrownSchedule || 'None'}\` ➔ \`${crownSchedule}\``, 
        inline: true 
      })
      .spliceFields(3, 0, { name: 'Status', value: statusUpdate })
    );
  }
};
