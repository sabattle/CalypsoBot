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
   let reps = await db.get(`userthanks_${user.id}`)
   if(!user) return this.sendErrorMessage(message, 0, "mention a user to delete reputation")
    
    db.delete(`userthanks_${user.id}`, reps)
    return message.react('👌')
    
}};
