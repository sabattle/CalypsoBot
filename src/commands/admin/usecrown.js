const Command = require('../Command.js');
const schedule = require('node-schedule');
const rotateCrown = require('../../utils/rotateCrown.js');
const { oneLine } = require('common-tags');

module.exports = class UseCrownCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usecrown',
      usage: '<BOOLEAN>',
      description: 'Enables or disables Calypso\'s crown role rotation.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    if (args.length) args = args[0].toLowerCase();
    // Convert to 0 or 1
    if (args ==  'true' || args == 'false') {
      args = (args == 'true');
      args = (+args).toString();
    }
    if (args === '0' || args === '1') {
      message.client.db.guildSettings.updateUseCrown.run(args, message.guild.id);
      if (args == 1) {
        message.channel.send(oneLine`
          Successfully **enabled** crown role rotating. Please note that a \`crown role\` and a \`crown schedule\` must
          be set.
        `);

        //Schedule crown role rotation
        const id = message.client.db.guildSettings.selectCrownRoleId.pluck().get(message.guild.id);
        let crownRole;
        if (id) crownRole = message.guild.roles.get(id);
        const cron = message.client.db.guildSettings.selectCrownSchedule.pluck().get(message.guild.id);
        if (crownRole && cron) {
          message.guild.job = schedule.scheduleJob(cron, rotateCrown(message.guild));
        }
      } else {
        if (message.guild.job) message.guild.job.cancel(); // Cancel old job
        message.channel.send('Successfully **disabled** crown role rotating.');
      }
    } else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
