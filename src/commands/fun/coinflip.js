const Command = require('../Command.js');

module.exports = class CoinFlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'coinflip',
      aliases: ['cointoss', 'flip', 'ct'],
      usage: '',
      description: 'Flips a coin.',
      type: 'fun'
    });
  }
  run(message) {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = 'heads';
    else result = 'tails';
    message.channel.send(`I flipped a coin for you, ${message.member}. It was **${result}**!`);
  }
};
