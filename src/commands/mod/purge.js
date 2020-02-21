const Command = require('../Command.js');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      usage: '<MESSAGE COUNT>',
      description: 'Deletes the specified amount of messages from a channel (limit is 50 at a time).',
      type: 'mod',
      clientPermissions: ['MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES']
    });
  }
  async run(message, args) {
    // Check permissions
    const permissions = this.checkPermissions(message);
    if (permissions !== true) return message.channel.send(permissions);

    const amount = parseInt(args.join());
    if (isNaN(amount) === true || !amount || amount <= 0 || amount > 50) 
      return message.channel.send(`${message.member}, please enter a number between 1 and 50.`);
    await message.delete(); // delete command message
    const messages = await message.channel.fetchMessages({ limit: amount });
    messages.forEach(async msg => {
      await msg.delete();
    });
    message.client.logger.info(`${message.member.displayName} used purge in ${message.channel.name}`);
  }
};
