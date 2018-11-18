const snekfetch = require('snekfetch');

module.exports = {
  name: 'yomomma',
  usage: '',
  description: 'Says a random yo momma joke.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('https://api.yomomma.info'));
      const joke = JSON.parse(res.text);
      message.channel.send(joke.joke);
    }
    catch (err) {
      console.log(err.message);
      return message.channel.send(`Sorry ${message.member}, something went wrong. Please try again in a few seconds.`);
    }
  }
};
