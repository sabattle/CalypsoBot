const Command = require('../Command.js');

module.exports = class TriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trivia',
      aliases: ['triv'],
      usage: '<TOPIC>',
      description: 'Test your knowledge in a game of trivia! If no topic is given, a random one will be chosen.',
      type: 'fun'
    });
  }
  run(message) {

  }
};
