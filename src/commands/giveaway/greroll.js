const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js')

module.exports = class GrerollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'greroll',
      usage: 'greroll <message_id>',
      description: 'Reroll\'s a giveaway',
      type: client.types.GIVEAWAY
    });
  }
  async run (message, args) {
          
    // If the member doesn't have enough permissions
    if(!message.member.hasPermission('MANAGE_MESSAGES') && !message.member.roles.cache.some((r) => r.name === "Giveaways")){
        return this.sendErrorMessage(message, 0, "You need to have the manage messages permissions to reroll giveaways.")
    }

    // If no message ID or giveaway name is specified
    if(!args[0]){
        return this.sendErrorMessage(message, 0, "You have to specify a valid message ID")
    }

    // try to found the giveaway with prize then with ID
    let giveaway = 
    // Search with giveaway prize
    this.client.giveawaysManager.giveaways.find((g) => g.prize === args.join(' ')) ||
    // Search with giveaway ID
    this.client.giveawaysManager.giveaways.find((g) => g.messageID === args[0]);

    // If no giveaway was found
    if(!giveaway){
        return message.channel.send('Unable to find a giveaway for `'+ args.join(' ') +'`.');
    }

    // Reroll the giveaway
    this.client.giveawaysManager.reroll(giveaway.messageID)
    .then(() => {
        // Success message
        message.channel.send('Giveaway rerolled!');
    })
    .catch((e) => {
        if(e.startsWith(`Giveaway with message ID ${giveaway.messageID} is not ended.`)){
            message.channel.send('This giveaway is not ended!');
        } else {
            console.error(e);
            message.channel.send('An error occured...');
        }
    });

}}