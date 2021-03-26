const Command = require('../Command.js');
const db = require('quick.db');
const {success} = require('../../utils/emojis.json')

module.exports = class AddrepCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrep',
      aliases: ['arep'],
      usage: 'addrep <amount> <user>',
      description: 'add reputation points to a User',
      ownerOnly: true,
      type: client.types.OWNER
    });
  }
  async run(message, args) {
      
    let user = message.mentions.users.first()
    if(!user) return this.sendErrorMessage(message, 0, "mention a user to vouch")
    
    db.add(`userthanks_${user.id}`, args[1])
    db.set(`cooldown_${message.author.id}`, Date.now())
    return message.react('👌')
    
}};
