const Command = require('../Command.js');

module.exports = class WipePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipepoints',
      usage: '<USER MENTION>',
      description: 'Wipes the mentioned user\'s points (or your own, if no user is mentioned).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    message.client.db.guildPoints.wipePoints.run(member.id, message.guild.id);
    message.channel.send(`Successfully wiped ${member}'s points.`);
  } 
};