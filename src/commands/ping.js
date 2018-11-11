module.exports = {
  name: 'ping',
  usage: '',
  description: 'Gets Calypso\'s current ping.',
  tag: 'general',
  run: (message) => {
    message.channel.send(`My current ping is: ${message.client.ping}ms.`);
  }
};
