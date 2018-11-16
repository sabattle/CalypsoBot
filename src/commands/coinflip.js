module.exports = {
  name: 'coinflip',
  usage: '',
  description: 'Flips a coin.',
  tag: 'fun',
  run: (message) => {
    const n = Math.floor(Math.random() * 2);
    let result;
    if (n === 1) result = 'heads';
    else result = 'tails';
    return message.channel.send(`I flipped a coin for you, ${message.member.displayName}. It was **${result}**!`);
  }
};
