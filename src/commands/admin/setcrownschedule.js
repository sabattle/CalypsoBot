const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const parser = require('cron-parser');
const scheduleCrown = require('../../utils/scheduleCrown.js');
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
        ' Step syntax is also supported, for example: `*/5 * * * *` (every 5 minutes). ' +
        'For the day of the week, both 0 and 7 may represent Sunday.' +
        'If you need additional help building your cron, please check out this website: <https://crontab.guru/#>. ' + 
        `Enter no schedule to clear the current crown schedule.
        **Please Note:** Not all months have the same amount of days.`,
      type: 'admin',
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setcrownschedule 0 21 * * 3,6', 'setcrownschedule * 0 12 /10 * *']
    });
  }
  run(message, args) {
    const oldCrownSchedule = message.client.db.settings.selectCrownSchedule.pluck().get(message.guild.id);
    const status = (oldCrownSchedule) ? '`enabled`' : '`disabled`';
    const embed = new MessageEmbed()
      .setTitle('Server Settings')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .addField('Setting', 'Crown Schedule', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    if (!message.content.includes(' ')) {
      message.client.db.settings.updateCrownSchedule.run(null, message.guild.id);
      return message.channel.send(embed
        .addField('Current Status', `${status} ➔ \`disabled\``, true)
        .addField('New Crown Schedule', '`None`')
      );
    }
    let cron = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    try {
      parser.parseExpression(cron);
    } catch (err) {
      return this.sendErrorMessage(message, oneLine`
        Invalid argument. Please try again with a valid cron expression. 
        If you need additional help building your cron, please check out this website: <https://crontab.guru/#>
      `);
    }
    message.client.db.settings.updateCrownSchedule.run(cron, message.guild.id);
    if (message.guild.job) message.guild.job.cancel(); // Cancel old job
    // Schedule crown role rotation
    scheduleCrown(message.client, message.guild);
    message.channel.send(embed
      .setDescription('Successfully updated the `crown schedule`. Please note that a `crown role` must also be set.')
      .addField('Current Status', `${status} ➔ \`enabled\``, true)
      .addField('New Crown Schedule', `\`${cron}\``)
    );
  }
};
