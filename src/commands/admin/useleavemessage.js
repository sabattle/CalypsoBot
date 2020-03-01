const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class UseLeaveMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'useleavemessage',
      usage: '<BOOLEAN>',
      description: 'Enables or disables Calypso\'s leave messages.',
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
      message.client.db.guildSettings.updateUseLeaveMessage.run(args, message.guild.id);
      if (args == 1)
        message.channel.send(oneLine`
          Successfully **enabled** leave messages. Please note that a \`leave message\` must also be set.
        `);
      else message.channel.send('Successfully **disabled** leave messages.');
    }
    else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
