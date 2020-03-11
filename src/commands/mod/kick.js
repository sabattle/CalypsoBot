const Command = require('../Command.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: '<USER MENTION> <REASON>',
      description: 'Kicks a member from your server.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS']
    });
  }
  async run(message, args) {
    const member = this.getMemberFromMention(message, args[0]);
    if (!member) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (member === message.member) return message.channel.send('You cannot kick yourself.'); 
    if (member.highestRole.position >= message.member.highestRole.position)
      return message.channel.send(`${message.member}, you cannot kick someone who has an equal or higher role.`);
    if (!member.kickable) return message.channel.send(`I am unable to kick ${member}.`);
    let reason = args.slice(1).join(' ');
    if(!reason) reason = 'No reason provided';
    await member.kick(reason);
    message.channel.send(`I have successfully kicked ${member}.`);
    message.client.logger.info(`${message.guild.name}: ${message.member.displayName} kicked ${member.displayName}`);
  }
};
