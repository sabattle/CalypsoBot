const updatePoints = require(__basedir + '/src/utils/updatePoints.js');

module.exports = {
  name: 'givepoints',
  usage: '<USER MENTION> <POINT COUNT>',
  description: 'Gives the specified amount of your own points to the mentioned user.',
  tag: 'fun',
  run: (message, args) => {
    const target = message.mentions.members.first();
    if (!target) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that user.`);
    const amount = parseInt(args[1]);
    const id = message.author.id, guild = message.guild.name;
    const score = message.client.getScore.get(id, guild);
    if (!score || score.points <= 0) return message.channel.send(`${message.member.displayName}, you have **0** points! Try earning some points first.`);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > score.points) return message.channel.send(`${message.member.displayName}, the amount of points to give must be a positive integer equal to or less than **${score.points}** (your total points).`);
    if (target.id === message.client.user.id) return message.channel.send('Thank you, you\'re too kind! But I must decline. I prefer not to take handouts.');
    updatePoints(message.client, id, guild, -amount);
    updatePoints(message.client, target.id, guild, amount);
    if (amount === 1) message.channel.send(`I transferred **${amount}** point to ${message.mentions.members.first().displayName}.`);
    else message.channel.send(`I transferred **${amount}** points to ${message.mentions.members.first().displayName}.`);
  }
};
