const Command = require('../Command.js');

module.exports = class TopicsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'topics',
      aliases: ['categories'],
      usage: '',
      description: 'Displays a list of all trivia topics.',
      type: 'fun'
    });
  }
  run(message) {
    let topics;
    message.client.topics.forEach(topic => {
      topics += '``' + topic + '``, ';
    });
    topics = topics.slice(9, -2);
    message.channel.send('Here is the list of all available trivia topics:\n' + topics);
  }
};
