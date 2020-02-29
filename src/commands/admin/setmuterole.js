const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SetMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmuterole',
      usage: '<ROLE | ROLE NAME>',
      description: 'Sets the mute role your server.',
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
    message.client.db.guildSettings.updateMuteRoleId.run(target.id, message.guild.id);
    message.channel.send(`Successfully updated the \`mute role\` to ${target}.`);
  }
};
