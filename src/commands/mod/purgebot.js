const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class PurgeBotCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purgebot',
      usage: '<MESSAGE COUNT>',
      description: oneLine`
        Sifts through the specified amount of messages and deletes any commands or messages from Calypso 
        (limit is 50 at a time).
      `,
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
    await message.delete();
    let messages = await message.channel.fetchMessages({limit: amount});
    messages = messages.array().filter(msg => { // Filter for commands or bot messages
      const command = message.client.commands.get(msg.content
        .trim().split(/ +/g).shift().slice(message.client.prefix.length).toLowerCase());
      if (msg.author.bot || command) return true;
    });
    messages.forEach(async msg => {
      await msg.delete();
    });
    message.channel.send(oneLine`
      I found **${messages.length}** messages (this message will be removed after 5 seconds).
    `).then(msg => {
      msg.delete(5000);
    });
    message.client.logger.info(`${message.member.displayName} used purgebot in ${message.channel.name}`);
  }
};
