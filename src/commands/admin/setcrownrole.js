const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetCrownRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcrownrole',
      usage: '<ROLE | ROLE NAME>',
      description: 'Sets the role Calypso will give members with the most points.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    args = args.join(' ').toLowerCase();
    const role = message.guild.roles.find(r => r.name.toLowerCase() === args);
    const target = message.mentions.roles.first() || role;
    if (!target) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateCrownRoleId.run(target.id, message.guild.id);
    message.channel.send(oneLine`
      Successfully updated the \`crown role\` to ${target}. Please note that a \`crown schedule\` must be set and
      \`use crown\` must be enabled. 
    `);
  }
};
