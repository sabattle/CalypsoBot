module.exports = {
  name: 'ping',
  usage: '',
  description: 'Gets Calypso\'s current ping.',
  tag: 'general',
  run: (message, args) => {
    message.channel.send(`Hey! This is my ping: ${message.client.ping}ms.`);
  }
}
