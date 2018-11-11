const Discord = require('discord.js');
let rpsList = ['scissors','rock', 'paper'];
let resList = ['Scissors :v:','Rock :fist:', 'Paper :raised_hand:'];

module.exports = {
  name: 'rps',
  usage: '<ROCK | PAPER | SCISSORS>',
  description: 'Play a game of rock–paper–scissors against Calypso!',
  tag: 'fun',
  run: (message, args) => {
    let uChoice = args.join().toLowerCase();
    if (!rpsList.includes(uChoice)) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that. Please enter \`rock\`, \`paper\`, or \`scissors\`.`);
    uChoice = rpsList.indexOf(uChoice);
    let bChoice = Math.floor(Math.random()*3);
    let result;
    if (uChoice === bChoice) result = 'It\'s a draw!';
    else if (bChoice > uChoice || bChoice === 0 && uChoice === 2) result = '**Calypso** wins!';
    else result = `**${message.member.displayName}** wins!`;
    let embed = new Discord.RichEmbed()
      .setAuthor(`${message.member.displayName} vs. Calypso`)
      .addField('Your Choice:', resList[uChoice], true)
      .addField('Calypso\'s Choice', resList[bChoice], true)
      .addField('Result', result, true)
      .setColor(message.client.color);
    message.channel.send(embed);
  }
};
