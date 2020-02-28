const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmodrole',
      usage: '<ROLE | ROLE NAME>',
      description: 'Sets the mod role for your server.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Check permissions
    const permission = this.checkPermissions(message);
    if (permission !== true) return message.channel.send(permission);
    args = args.join(' ').toLowerCase();
    const role = message.guild.roles.find(r => r.name.toLowerCase() === args);
    const target = message.mentions.roles.first() || role;
    if (!target) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateModRoleId.run(target.id, message.guild.id);
    message.channel.send(`Successfully updated the \`mod role\` to ${target}.`);
  }
};
