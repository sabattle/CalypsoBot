const Command = require('../Command.js');

module.exports = class WipePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipepoints',
      aliases: ['wipep', 'wp'],
      usage: '<USER MENTION>',
      description: 'Wipes the mentioned user\'s points (or your own, if no user is mentioned).',
      type: types.OWNER,
      ownerOnly: true
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    message.client.db.users.wipeUserPoints.run(member.id, message.guild.id);
    message.channel.send(`Successfully wiped ${member}'s points.`);
  } 
};