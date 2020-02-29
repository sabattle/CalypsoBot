const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class UseVoicePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usevoicepoints',
      usage: '<BOOLEAN>',
      description: 'Enables or disables Calypso\'s voice point tracking.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    if (args.length !== 0) args = args[0].toLowerCase();
    // Convert to 0 or 1
    if (args ==  'true' || args == 'false') {
      args = (args == 'true');
      args = (+args).toString();
    }
    if (args === '0' || args === '1') {
      message.client.db.guildSettings.updateUseVoicePoints.run(args, message.guild.id);
      if (args == 1) message.channel.send(oneLine`
        Successfully **enabled** voice point tracking. Please note that \`use points\` must be enabled.
      `);
      else message.channel.send('Successfully **disabled** voice point tracking.');
    }
    else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
