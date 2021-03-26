const Command = require('../Command.js');
const db = require('quick.db');

module.exports = class DelrepCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'delrep',
      aliases: ['dr'],
      usage: 'clearvouches @user',
      description: 'Clear vouches of a User',
      ownerOnly: true,
      type: client.types.OWNER
    });
  }
  async run(message) {
 

    let user = message.mentions.users.first()
    if(!user) return this.sendErrorMessage(message, 0, "mention a user to vouch")

    
    db.delete(`userthanks_${user.id}`, 1)
    db.set(`cooldown_${message.author.id}`, Date.now())
    return message.react('👍')
    
}};
