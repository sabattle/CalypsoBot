module.exports = {
  name: 'topics',
  usage: '',
  description: 'Fetches the list of available trivia topics.',
  tag: 'fun',
  run: (message) => {
    let topics;
    message.client.topics.forEach(topic => {
      topics += '``' + topic + '``, ';
    });
    topics = topics.slice(9, -2);
    message.channel.send('Here is the list of topics:\n' + topics);
  }
};
