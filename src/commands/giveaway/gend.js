const Command = require('../Command.js');

module.exports = class GendCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gend',
      usage: 'gend <message_id>',
      description: 'End\'s a giveaway',
      type: client.types.GIVEAWAY
    });
  }
  async run (message, args) {
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
      return message.channel.send(':x: You need to have the manage messages permissions to reroll giveaways.');
  }

  // If no message ID or giveaway name is specified
  if(!args[0]){
      return message.channel.send(':x: You have to specify a valid message ID!');
  }

  // try to found the giveaway with prize then with ID
  let giveaway = 
  // Search with giveaway prize
  this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
  // Search with giveaway ID
  this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

  // If no giveaway was found
  if(!giveaway){
      return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') + '`.');
  }

  // Edit the giveaway
  this.client.giveawaysManager.edit(giveaway.messageID, {
      setEndTimestamp: Date.now()
  })
  // Success message
  .then(() => {
      // Success message
      message.channel.send('Giveaway will end in less than '+(this.client.giveawaysManager.options.updateCountdownEvery/1000)+' seconds...');
  })
  .catch((e) => {
      if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is already ended.`)){
          message.channel.send('This giveaway is already ended!');
      } else {
          console.error(e);
          message.channel.send('An error occured...');
      }
  });
  }
}