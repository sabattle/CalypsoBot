const snekfetch = require('snekfetch');

module.exports = {
  name: 'catfact',
  usage: '',
  description: 'Calypso will say a random cat fact.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('https://catfact.ninja/fact')).body.fact;
      message.channel.send(res);
    }
    catch (err) {
      return message.channel.send('Something went wrong, please try again in a few seconds.');
    }
  }
};
