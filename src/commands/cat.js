const Discord = require('discord.js');
const snekfetch = require('snekfetch');

module.exports = {
  name: 'cat',
  usage: '',
  description: 'Calypso will find a random cat for your viewing pleasure.',
  tag: 'fun',
  run: async (message, args) => {
    let img = null;
    const maxTries = 5;
    let counter = 0;
    while(!img && counter < maxTries){ // try to get cat image 5 times
        try {
          img = (await snekfetch.get('http://aws.random.cat/meow')).body.file;
        } catch (err) {
          console.log('!cat failed, error: ' + err.message);
          img = null;
          counter++;
        }
    }
    if (!img) return message.channel.send('Yikes, I think the kitties are on the fritz! Try again in a few seconds.') // GET failed, try again later
    let embed = new Discord.RichEmbed() // GET was successful, send image to discord
      .setAuthor('Meow!')
      .setImage(img)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
}
