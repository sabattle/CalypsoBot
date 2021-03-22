const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch')
module.exports = class EjectCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eject',
      aliases: ['imposter'],
      usage: 'eject <user>',
      description: 'ejects a user in amongus style',
      type: client.types.FUN
    });
  }
async run (message, args) {
    
    try {

const user = message.mentions.users.first() || (args.length > 0 ? message.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first(): message.author) || message.author;
const imp = [true, false];
const imposter = imp[Math.floor(Math.random() * imp.length)];
const crew = ["black", "blue", "brown", "cyan", "darkgreen", "lime", "orange", "pink", "purple", "red", "white", "yellow"]
const crewmate = crew[Math.floor(Math.random() * crew.length)];

const data = await fetch(`https://vacefron.nl/api//ejected?name=${user.username}&impostor=${imposter}&crewmate=${crewmate}`)
const attachment = data.url
const embed = new MessageEmbed()
.setTitle(`${message.author.username} decided to eject ${user.username}`)
.setImage(attachment)
.setColor('RANDOM')
message.channel.send(embed)
} catch (err) {
    message.client.logger.error(err.stack);
    this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
  }
}
};