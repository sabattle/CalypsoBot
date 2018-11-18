const snekfetch = require('snekfetch');

module.exports = {
  name: 'catfact',
  usage: '',
  description: 'Says a random cat fact.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('https://catfact.ninja/fact')).body.fact;
      message.channel.send(res);
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
