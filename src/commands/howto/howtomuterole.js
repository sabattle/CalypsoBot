const Command = require('../Command.js');

module.exports = class HowToMuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtomuterole',
      aliases: ['h2muterole'],
      usage: '',
      description: 'Explains how to create a proper mute role on your server.',
      type: 'howto'
    });
  }
  run(message) {

  }
};
