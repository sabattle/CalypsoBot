const Command = require('../Command.js');

module.exports = class WipeAllPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipeallpoints',
      aliases: ['wipeap', 'wap'],
      usage: '<USER MENTION>',
      description: 'Wipes the mentioned user\'s points and total points (or your own, if no user is mentioned).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    message.client.db.guildPoints.wipeAllPoints.run(member.id, message.guild.id);
    message.channel.send(`Successfully wiped ${member}'s points and total points.`);
  } 
};