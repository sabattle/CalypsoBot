module.exports = {
  name: 'roll',
  usage: '<POSITIVE INTEGER>',
  description: 'Rolls a random number between 1 and the number specified (or 6, if no number is given).',
  tag: 'fun',
  run: (message, args) => {
    let limit = args.join();
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please enter a positive integer.`);
    message.channel.send(`${message.member}, you rolled a **${n}**.`);
  }
};
