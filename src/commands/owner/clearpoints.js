const Command = require('../Command.js');
const { oneLine } = require('common-tags');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class ClearPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearpoints',
      aliases: ['clearp', 'clrp'],
      usage: '<SERVER ID>',
      description: oneLine`
        Clears all members' points in the server with the provided ID (or the current server, if no ID is given).
      `,
      type: 'owner',
      ownerOnly: true
    });
  }
  run(message, args) {
    const id = args[0] || message.guild.id;
    if (!rgx.test(id)) 
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please provide a valid server ID.`);
    const guild = message.client.guilds.get(id);
    if (!guild) 
      return message.channel.send(oneLine`
        Sorry ${message.member}, I couldn't find that server. Please check the provided ID.
      `);
    message.client.db.guildPoints.clearPoints.run(id);
    message.channel.send(`Successfully cleared all members' points in ${guild.name}.`);
  } 
};