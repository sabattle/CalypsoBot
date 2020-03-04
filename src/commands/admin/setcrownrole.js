const Command = require('../Command.js');
const scheduleCrown = require('../../utils/scheduleCrown.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      aliases: ['setcr', 'scr'],
      usage: '<ROLE MENTION | ROLE NAME>',
      description: 'Sets the role Calypso will give members with the most points (provide no role to clear).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateCrownRoleId.run(null, message.guild.id);
      return message.channel.send('Successfully **cleared** the `crown role`.');
    } 
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateCrownRoleId.run(role.id, message.guild.id);
    message.channel.send(oneLine`
      Successfully updated the \`crown role\` to ${role}. Please note that \`use points\` must be enabled and a
      \`crown schedule\` must be set. 
    `);

    // Schedule crown role rotation
    scheduleCrown(message.client, message.guild);
  }
};
