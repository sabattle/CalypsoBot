const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetAutoRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setautorole',
      usage: '<ROLE MENTION | ROLE NAME>',
      description: 'Sets the role all new members will receive upon joining your server (provide no role to clear).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateAutoRoleId.run(null, message.guild.id);
      return message.channel.send('Successfully **cleared** the `auto role`.');
    } 
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateAutoRoleId.run(role.id, message.guild.id);
    message.channel.send(`Successfully updated the \`auto role\` to ${role}.`);
  }
};
