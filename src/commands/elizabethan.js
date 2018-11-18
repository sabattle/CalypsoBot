const snekfetch = require('snekfetch');

module.exports = {
  name: 'elizabethan',
  usage: '',
  description: 'Says a random Elizabethan insult.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('http://quandyfactory.com/insult/json/')).body.insult;
      message.channel.send(res);
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
