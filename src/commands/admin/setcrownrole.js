const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      usage: '<ROLE MENTION | ROLE NAME>',
      description: 'Sets the role Calypso will give members with the most points.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateCrownRoleId.run(role.id, message.guild.id);
    message.channel.send(oneLine`
      Successfully updated the \`crown role\` to ${role}. Please note that a \`crown schedule\` must be set and
      \`use crown\` must be enabled. 
    `);
  }
};
