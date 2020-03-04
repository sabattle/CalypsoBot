const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class GivePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'givepoints',
      aliases: ['gp'],
      usage: '<USER MENTION> <POINT COUNT>',
      description: 'Gives the specified amount of your own points to the mentioned user.',
      type: 'point'
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]);
    const amount = parseInt(args[1]);
    if (!member) return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please mention a user.`);
    if (member.id === message.client.user.id) 
      return message.channel.send('Thank you, you\'re too kind! But I must decline. I prefer not to take handouts.');
    const points = message.client.db.guildPoints.selectPoints.pluck().get(message.author.id, message.guild.id);
    if (points === 0) 
      return message.channel.send(`${message.member}, you have **0** points! Try earning some points first.`);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > points) 
      return message.channel.send(oneLine`
        ${message.member}, you can't give that much! You currently have **${points}** points.
      `);
    // Remove points
    message.client.db.guildPoints.updatePoints.run({ points: -amount }, message.author.id, message.guild.id);
    // Add points
    message.client.db.guildPoints.updatePoints.run({ points: amount }, member.id, message.guild.id);
    if (amount === 1) message.channel.send(`I transferred **${amount}** point to ${member}.`);
    else message.channel.send(`I transferred **${amount}** points to ${member}.`);
  }
};
