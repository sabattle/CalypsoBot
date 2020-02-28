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
  run(message) {
    const target =  message.mentions.members.first() || message.member;
    message.client.db.guildPoints.wipePoints.run(target.id, message.guild.id);
    message.channel.send(`Successfully wiped ${target}'s points.`);
  } 
};