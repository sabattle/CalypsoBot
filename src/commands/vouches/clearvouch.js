const Command = require('../Command.js');
const db = require('quick.db');

module.exports = class MyVouchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearvouches',
      aliases: ['clq'],
      usage: 'clearvouches @user',
      description: 'Clear vouches of a User',
      ownerOnly: true,
      type: client.types.OWNER
    });
  }
  async run(message) {
 

    let user = message.mentions.users.first()
    if(!user) return this.sendErrorMessage(message, 0, "mention a user to vouch")
    if(user.id === message.author.id) return this.sendErrorMessage(message, 0, "you cant vouch yourself")
    
    db.delete(`userthanks_${user.id}`, 1)
    db.set(`cooldown_${message.author.id}`, Date.now())
    return message.react('👍')
    
}};
