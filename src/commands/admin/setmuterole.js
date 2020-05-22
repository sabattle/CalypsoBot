const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      aliases: ['setmur', 'smur'],
      usage: '<ROLE MENTION | ROLE NAME>',
      description: 'Sets the mute role your server (provide no role to clear).',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    // Clear if no args provided
    if (args.length === 0) {
      message.client.db.guildSettings.updateMuteRoleId.run(null, message.guild.id);
      return message.channel.send('Successfully **cleared** the `mute role`.');
    } 
    const roleName = args.join(' ').toLowerCase();
    let role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName);
    role = this.getRoleFromMention(message, args[0]) || role;
    if (!role) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a role or provide a role name.
    `);
    message.client.db.guildSettings.updateMuteRoleId.run(role.id, message.guild.id);
    message.channel.send(`Successfully updated the \`mute role\` to ${role}.`);
  }
};
