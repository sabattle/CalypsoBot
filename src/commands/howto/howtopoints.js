const Command = require('../Command.js');

module.exports = class HowToPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'howtopoints',
      aliases: ['h2points'],
      usage: '',
      description: 'Explains various aspects about Calypso\'s point system.',
      type: 'howto'
    });
  }
  run(message) {

  }
};
