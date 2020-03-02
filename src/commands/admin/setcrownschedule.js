const Command = require('../Command.js');
const schedule = require('node-schedule');
const parser = require('cron-parser');
const rotateCrown = require('../../utils/rotateCrown.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SetCrownScheduleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownschedule',
      aliases: ['scs'],
      usage: '',
      description: 'Sets the schedule for Calypso\'s crown role rotation.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message) {
    message.channel.send(stripIndent`
      ${message.author}, I am now waiting for the new crown schedule. The format is cron-style:
      \`\`\`*    *    *    *    *    *
      ┬    ┬    ┬    ┬    ┬    ┬
      │    │    │    │    │    │
      │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
      │    │    │    │    └───── month (1 - 12)
      │    │    │    └────────── day of month (1 - 31)
      │    │    └─────────────── hour (0 - 23)
      │    └──────────────────── minute (0 - 59)
      └───────────────────────── second (0 - 59, OPTIONAL)\`\`\`
      If you wish to use multiple values for any of the categories, please seperate them with a \`,\`.
      Step syntax is also supported, for example: \`*/5 * * * *\` (every 5 minutes).
      **Please note**: Not all months have the same amount of days. This will timeout after 3 minutes.
    `);
    const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    message.channel.awaitMessages(m => {
      let command, alias;
      if (m.content.startsWith(prefix)){
        const args = m.content.trim().split(/ +/g);
        const cmd = args.shift().slice(prefix.length).toLowerCase();
        command = message.client.commands.get(cmd);
        alias = message.client.aliases.get(cmd);
      }
      if (m.author == message.author && !command && !alias) return true;
    }, { maxMatches: 1, time: 180000 }) // Three minute timer
      .then(messages => {
        const cron = messages.first().content;
        try {
          parser.parseExpression(cron);
        } catch (err) {
          return message.channel.send(oneLine`
            Sorry ${message.author}, I don't recognize that. Please try again with a valid cron expression.
          `);
        }
        message.client.db.guildSettings.updateCrownSchedule.run(cron, message.guild.id);
        message.channel.send(oneLine`
          Successfully updated the \`crown schedule\` to \`${cron}\`. Please note that \`use crown\` must be enabled and 
          a \`crown role\` must be set. 
        `);
        if (message.guild.job) message.guild.job.cancel(); // Cancel old job

        //Schedule crown role rotation
        const enabled = message.client.db.guildSettings.selectUseCrown.pluck().get(message.guild.id);
        const id = message.client.db.guildSettings.selectCrownRoleId.pluck().get(message.guild.id);
        let crownRole;
        if (id) crownRole = message.guild.roles.get(id);
        if (enabled && crownRole) {
          message.guild.job = schedule.scheduleJob(cron, rotateCrown(message.guild));
        }

      })
      .catch(() => message.channel.send(`${message.author}, operation has timed out. Please try again.`));
  }
};
