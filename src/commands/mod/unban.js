const Command = require('../Command.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: '<USER ID> <REASON>',
      description: 'Unbans a member from your server.',
      type: 'mod',
      clientPermissions: ['SEND_MESSAGES', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) 
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please provide a valid user ID.`);
    const bannedUsers = await message.guild.fetchBans();
    const user = bannedUsers.get(id);
    if (!user) 
      return message.channel.send(`Sorry ${message.member}, I couldn't find that user. Please check the provided ID.`);
    let reason = args.slice(1).join(' ');
    if(!reason) reason = 'No reason provided';
    await message.guild.unban(user, reason);
    message.channel.send(`I have successfully unbanned ${user.username}.`);
    message.client.logger.info(`${message.guild.name}: ${message.member.displayName} banned ${user.username}`);
  }
};
