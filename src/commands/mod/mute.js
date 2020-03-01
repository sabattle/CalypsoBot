const Command = require('../Command.js');
const ms = require('ms');
const { oneLine } = require('common-tags');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: '<USER MENTION> <TIME>',
      description: 'Mutes a user for the specified amount of time (max is 10 days).',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'MUTE_MEMBERS', 'MANAGE_ROLES'],
      userPermissions: ['MUTE_MEMBERS']
    });
  }
  async run(message, args) {
    const id = message.client.db.guildSettings.selectMuteRoleId.pluck().get(message.guild.id);
    let muteRole;
    if (id) muteRole = message.guild.roles.get(id);
    else return message.channel.send('There is currently no `mute role` set on this server.');
    const member = this.getMemberFromMention(message, args[0]);
    if (!member) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (member.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot mute someone who has an equal or higher role.`);
    let time = ms(args[1]);
    if (!time || time > 864000000) // Cap at 10 days, larger than 24.8 days causes integer overflow
      return message.channel.send(oneLine`
        ${message.member}, please enter a length of time of 10 days or less (\`1s\`/\`m\`/\`h\`/\`d\`).
      `);
    if (member.roles.has(id)) return message.channel.send(`${member} is already muted!`);
    await member.addRole(muteRole);
    message.channel.send(`${member} has now been muted for **${ms(time, { long: true })}**.`);
    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.removeRole(muteRole);
        message.channel.send(`${member} has been unmuted.`);
      } catch (err) {
        message.client.logger.error(err.message);
      }
    }, time);
    message.client.logger.info(`${message.member.displayName} muted ${member.displayName}`);
  }
};
