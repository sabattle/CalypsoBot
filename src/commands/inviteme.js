module.exports = {
  name: 'inviteme',
  usage: '',
  description: 'Generates a link you can use to invite Calypso to your own server.',
  tag: 'general',
  run: (message) => {
    message.channel.send('You can use this link to invite me to your server:\n https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=2146958679');
  }
};
