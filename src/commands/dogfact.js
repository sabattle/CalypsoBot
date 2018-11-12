const snekfetch = require('snekfetch');

module.exports = {
  name: 'dogfact',
  usage: '',
  description: 'Calypso will say a random dog fact.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('https://dog-api.kinduff.com/api/facts')).body.facts[0];
      message.channel.send(res);
    }
    catch (err) {
      return message.channel.send('Something went wrong, please try again in a few seconds.');
    }
  }
};
