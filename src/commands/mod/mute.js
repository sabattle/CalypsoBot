const Command = require('../Command.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: '<USER MENTION> <TIME>',
      description: 'Mutes a user for the specified amount of time.',
      type: 'mod',
      clientPermissions: ['MUTE_MEMBERS', 'MANAGE_ROLES'],
      userPermissions: ['MUTE_MEMBERS']
    });
  }
  async run(message, args) {
    // Check permissions
    const permissions = this.checkPermissions(message);
    if (permissions !== true) return message.channel.send(permissions);
    const id = message.client.db.guildSettings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (id) muteRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `mute role` set on this server.');
    const target = message.mentions.members.first();
    if (!target) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (target.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot mute someone who has an equal or higher role.`);
    const time = ms(args[1]);
    if (!time) return message.channel.send(`${message.member}, please enter a length of time (1s/m/h/d).`);
    if (target.roles.has(id)) return message.channel.send(`${target} is already muted!`);
    await target.addRole(muteRole);
    message.channel.send(`${target} has now been muted for **${ms(time)}**.`);
    target.timeout = message.client.setTimeout(async () => {
      try {
        await target.removeRole(muteRole);
        message.channel.send(`${target} has been unmuted.`);
      } catch (err) {
        message.client.logger.error(err.message);
      }
    }, time);
    message.client.logger.info(`${message.member.displayName} muted ${target.displayName}`);
  }
};
