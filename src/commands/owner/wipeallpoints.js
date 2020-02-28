const Command = require('../Command.js');

module.exports = class WipeAllPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'wipeallpoints',
      usage: '<USER MENTION>',
      description: 'Wipes the mentioned user\'s points and total points (or your own, if no user is mentioned).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message) {
    const target =  message.mentions.members.first() || message.member;
    message.client.db.guildPoints.wipeAllPoints.run(target.id, message.guild.id);
    message.channel.send(`Successfully wiped ${target}'s points and total points.`);
  } 
};