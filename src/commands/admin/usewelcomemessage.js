const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class UseWelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'usewelcomemessage',
      usage: '<BOOLEAN>',
      description: 'Enables or disables Calypso\'s welcome messages.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    const permission = this.checkPermissions(message);
    if (permission !== true) return message.channel.send(permission);
    args = args[0].toLowerCase();
    // Convert to 0 or 1
    if (args ==  'true' || args == 'false') {
      args = (args == 'true');
      args = +args;
    }
    if (args == 0 || args == 1) {
      message.client.db.guildSettings.updateUseWelcomeMessage.run(args, message.guild.id);
      let val;
      if (args == 1) val = 'enabled';
      else val = 'disabled'; 
      message.channel.send(`Sucessfully **${val}** welcome messages.`);
    }
    else message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please enter a boolean value (\`true\`, \`false\`, \`1\`, \`0\`).
    `);
  }
};
