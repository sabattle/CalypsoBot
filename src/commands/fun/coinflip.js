const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CoinFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coinflip',
      aliases: ['cointoss', 'coin', 'flip'],
      usage: 'coinflip',
      description: 'Flips a coin.',
      type: client.types.FUN
    });
  }
  run(message) {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = 'heads';
    else result = 'tails';
    return message.channel.send(`<a:AnimePraise:794515258928005140> **${message.member.user.tag}**: It\'s ${result}`)
  }
};