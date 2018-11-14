const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'trivia',
  usage: '<TOPIC>',
  description: 'Test your knowledge in a game of trivia! You have 10 seconds to answer.',
  tag: 'fun',
  run: (message, args) => {
    const topic = args[0];
    const path = __basedir + '/data/trivia/' + topic + '.txt';
    if (!message.client.topics.includes(topic)) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that topic. Please use \`\`!topics\`\` to see a list.`);
    const topics = fs.readFileSync(path).toString().split('\n');
    let count = topics.length;
    const n = Math.floor(Math.random() * count);
    const question = topics[n].split('`').shift();
    let answers = topics[n].split('`');
    let realAnswers = '';
    answers.shift();
    for (let i = 0; i < answers.length; i++){
      realAnswers = realAnswers + ' | ' + answers[i];
      answers[i] = answers[i].toLowerCase();
    }
    realAnswers = '**' + realAnswers.slice(2) + '**';
    message.channel.send(question);
    let winner;
    const collector = new Discord.MessageCollector(message.channel, m => {
      if (!m.author.bot) return true;
    }, { time: 10000 });
    collector.on('collect', msg => {
      if (answers.includes(msg.content.toLowerCase())) {
        winner = msg.author;
        collector.stop();
      }
    });
    collector.on('end', () => {
      if (winner) message.channel.send(`Congratulations ${winner}, you gave the correct answer!`);
      else message.channel.send('Time\'s up! Better luck next time!\nCorrect answers: ' + realAnswers);
    });
  }
};
