const Command = require('../Command.js');
const { MersenneTwister19937, integer } = require('random-js');

module.exports = class PpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pp',
      aliases: ['dicksize', 'dick'],
      usage: 'dicksize @user',
      description: 'Send\'s someone pp size',
      type: client.types.FUN
    });
  }

  run(msg, args) {
    let user = msg.mentions.members.first() || msg.guild.members.cache.get(args[0]) || msg.member;
    if (this.client.isOwner(user)) {
      if (user.id === msg.author.id) return msg.channel.send(`**${user.displayName}'s Size:**\n8D`);
      return msg.channel.send(`**${user.displayName}'s Size:**\n8=D`);
    }
    const clientAuthor = user.id === this.client.user.id;
    const random = MersenneTwister19937.seed(clientAuthor ? msg.author.id : user.id);
    const length = integer(0, 50)(random);
    return msg.channel.send(`**${user.displayName}'s Size:**\n8${'='.repeat(clientAuthor ? length + 1 : length)}D`);

  }
};