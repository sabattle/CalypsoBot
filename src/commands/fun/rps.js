const Command = require('../Command.js');
const Discord = require('discord.js');
const { oneLine } = require('common-tags');
const rps = ['scissors','rock', 'paper'];
const res = ['Scissors :v:','Rock :fist:', 'Paper :raised_hand:'];

module.exports = class RockPaperScissorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rps',
      usage: '<ROCK | PAPER | SCISSORS>',
      description: 'Play a game of rock–paper–scissors against Calypso!',
      type: 'fun'
    });
  }
  run(message, args) {
    let userChoice;
    if (args.length) userChoice = args[0].toLowerCase();
    if (!rps.includes(userChoice)) 
      return message.channel.send(oneLine`
        Sorry ${message.member}, I don't recognize that. Please enter \`rock\`, \`paper\`, or \`scissors\`.
      `);
    userChoice = rps.indexOf(userChoice);
    const botChoice = Math.floor(Math.random()*3);
    let result;
    if (userChoice === botChoice) result = 'It\'s a draw!';
    else if (botChoice > userChoice || botChoice === 0 && userChoice === 2) result = '**Calypso** wins!';
    else result = `**${message.member.displayName}** wins!`;
    const embed = new Discord.RichEmbed()
      .setTitle(`${message.member.displayName} vs. Calypso`)
      .addField('Your Choice:', res[userChoice], true)
      .addField('Calypso\'s Choice', res[botChoice], true)
      .addField('Result', result, true)
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
