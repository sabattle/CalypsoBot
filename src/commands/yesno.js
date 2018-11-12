const snekfetch = require('snekfetch');

module.exports = {
  name: 'yesno',
  usage: '',
  description: 'Can\'t decide on something? Calypso will fetch a gif of a yes or a no.',
  tag: 'fun',
  run: async (message) => {
    try {
      const res = (await snekfetch.get('http://yesno.wtf/api/')).body.image;
      message.channel.send(res);
    }
    catch (err) {
      return message.channel.send('Something went wrong, please try again in a few seconds.');
    }
  }
};
