const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class UsePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usepoints',
      usage: '<BOOLEAN>',
      description: 'Enables or disables Calypso\'s point tracking.',
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
      message.client.db.guildSettings.updateUsePoints.run(args, message.guild.id);
      if (args == 1) message.channel.send('Successfully **enabled** point tracking.');
      else message.channel.send('Successfully **disabled** point tracking.');
    } else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
