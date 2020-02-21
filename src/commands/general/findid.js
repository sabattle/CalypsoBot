const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'findid',
      aliases: ['id'],
      usage: '<USER MENTION | TEXT CHANNEL | ROLE>',
      description: 'Finds the ID of the mentioned user or text channel.',
      type: 'general'
    });
  }
  run(message) {
    const target = message.mentions.members.first() || 
      message.mentions.channels.first() || 
      message.mentions.roles.first();
    if (!target) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a user, text channel, or role.
    `);
    const id = target.id;
    message.channel.send(`The ID for ${target} is **${id}**.`);
  }
};
