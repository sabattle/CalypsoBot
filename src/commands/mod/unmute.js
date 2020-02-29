const Command = require('../Command.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: '<USER MENTION>',
      description: 'Unmutes the specified user.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MUTE_MEMBERS', 'MANAGE_ROLES'],
      userPermissions: ['MUTE_MEMBERS']
    });
  }
  async run(message) {
    const id = message.client.db.guildSettings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (id) muteRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `mute role` set on this server.');
    const target = message.mentions.members.first();
    if (!target) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (target.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot unmute someone who has an equal or higher role.`);
    if (target.roles.has(id)) {
      message.client.clearTimeout(target.timeout);
      await target.removeRole(muteRole);
      message.channel.send(`${target} has been unmuted.`);
    } 
    else return message.channel.send(`${target} is not muted!`);
    message.client.logger.info(`${message.member.displayName} unmuted ${target.displayName}`);
  }
};
