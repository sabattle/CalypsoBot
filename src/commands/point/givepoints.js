const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class GivePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'givepoints',
      usage: '<USER MENTION> <POINT COUNT>',
      description: 'Gives the specified amount of your own points to the mentioned user.',
      type: 'point'
    });
  }
  run(message, args) {
    const target = message.mentions.members.first();
    const amount = parseInt(args[1]);
    const enabled = message.client.db.guildSettings.selectUsePoints.pluck().get(message.guild.id);
    if (!enabled) return message.channel.send('Points are currently **disabled** on this server.');
    if (!target) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (target.id === message.client.user.id) 
      return message.channel.send('Thank you, you\'re too kind! But I must decline. I prefer not to take handouts.');
    const points = message.client.db.guildPoints.selectPoints.pluck().get(message.author.id, message.guild.id);
    if (points === 0) 
      return message.channel.send(`${message.member}, you have **0** points! Try earning some points first.`);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > points) 
      return message.channel.send(oneLine`
        ${message.member}, the amount of points to give must be a positive integer equal to or less than **${points}** 
        (your current points).
      `);
    // Remove points
    message.client.db.guildPoints.updatePoints.run({ points: -amount }, message.author.id, message.guild.id);
    // Add points
    message.client.db.guildPoints.updatePoints.run({ points: amount }, target.id, message.guild.id);
    if (amount === 1) message.channel.send(`I transferred **${amount}** point to ${target}.`);
    else message.channel.send(`I transferred **${amount}** points to ${target}.`);
  }
};
