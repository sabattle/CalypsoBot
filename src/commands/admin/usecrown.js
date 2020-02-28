const Command = require('../Command.js');
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
    // Check permissions
    const permission = this.checkPermissions(message);
    if (permission !== true) return message.channel.send(permission);
    args = args.join().toLowerCase();
    // Convert to 0 or 1
    if (args ==  'true' || args == 'false') {
      args = (args == 'true');
      args = (+args).toString();
    }
    if (args === '0' || args === '1') {
      message.client.db.guildSettings.updateUseCrown.run(args, message.guild.id);
      let val;
      if (args == 1) val = 'enabled';
      else val = 'disabled'; 
      message.channel.send(oneLine`
        Successfully **${val}** crown role rotating. Please note that a \`crown schedule\` must also be set.
      `);
    }
    else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
