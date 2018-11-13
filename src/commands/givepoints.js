module.exports = {
  name: 'givepoints',
  usage: '<USER MENTION> <POINT COUNT>',
  description: 'Give the specified amount of your own points to the mentioned user.',
  tag: 'fun',
  run: (message, args) => {
    const updatePoints = require(__basedir + '/src/utils/updatePoints.js');
    let target = message.mentions.members.first().id;
    if (!target) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that user.`);
    let amount = parseInt(args[1]);
    let id = message.author.id, guild = message.guild.name;
    let score = message.client.getScore.get(id, guild);
    if (!score) message.channel.send(`${message.member.displayName}, you have **0** points! Try earning some points first.`);
    if (isNaN(amount) === true || !amount || amount <= 0 || amount > score.points) return message.channel.send(`Please enter a positive integer less than or equal to **${score.points}** (your total points).`);
    updatePoints(message.client, id, guild, -amount);
    updatePoints(message.client, target, guild, amount);
    message.channel.send(`I transfered **${amount}** point(s) to ${message.mentions.members.first().displayName}.`);
  }
};
