const Command = require('../Command.js');

module.exports = class InviteMeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'inviteme',
      aliases: ['invite', 'invme', 'im'],
      usage: 'inviteme',
      description: 'Generates a link you can use to invite Calypso to your own server.',
      type: 'general'
    });
  }
  run(message) {
    message.channel.send(`
      You can use this link to invite me to your server:
      <https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=268528727>
    `);
  }
};
