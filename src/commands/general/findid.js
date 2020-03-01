const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class FindIdCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'findid',
      aliases: ['id'],
      usage: '<USER MENTION | ROLE MENTION | CHANNEL MENTION>',
      description: 'Finds the ID of the mentioned user, role, or text channel.',
      type: 'general'
    });
  }
  run(message, args) {
    const target = this.getMemberFromMention(message, args[0]) || 
                   this.getRoleFromMention(message, args[0]) || 
                   this.getChannelFromMention(message, args[0]);
    if (!target) return message.channel.send(oneLine`
      Sorry ${message.member}, I don't recognize that. Please mention a user, role, or text channel.
    `);
    const id = target.id;
    message.channel.send(`The ID for ${target} is **${id}**.`);
  }
};
