const Command = require('../Command.js');

module.exports = class ShowPermissionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'showpermissions',
      aliases: ['showp', 'shp'],
      usage: '<USER MENTION>',
      description: 'Displays all available permissions (or your own, if no user is mentioned).',
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const member =  this.getMemberFromMention(message, args[0]) || message.member;
    if (!member) 
      return message.channel.send('No member was mentioned.');
    message.channel.send(member.permissions.toArray().join('\n'));
  }
};