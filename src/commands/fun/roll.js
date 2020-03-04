const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class RollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'roll',
      aliases: ['dice', 'r'],
      usage: '<DICE SIDES>',
      description: 'Rolls a dice with the specified number of sides (or 6 sides, if no number is given).',
      type: 'fun'
    });
  }
  run(message, args) {
    let limit = args[0];
    if (!limit) limit = 6;
    const n = Math.floor(Math.random() * limit + 1);
    if (!n || limit <= 0) 
      return message.channel.send(oneLine`
        Sorry ${message.member}, I don't recognize that. Please specify the number of dice sides.
      `);
    message.channel.send(`${message.member}, you rolled a **${n}**.`);
  }
};
