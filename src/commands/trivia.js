const fs = require('fs');
const Discord = require('discord.js');

module.exports = {
  name: 'trivia',
  usage: '<TOPIC>',
  description: 'Test your knowledge in a game of trivia! You have 10 seconds to answer. If no topic is given, a random one will be chosen.',
  tag: 'fun',
  run: (message, args) => {
    let topic = args[0];
    let randomPick = false;
    if (!topic){ // pick random topic if none given
      topic = message.client.topics[Math.floor(Math.random() * message.client.topics.length)];
      randomPick = true;
    }
    else if (!message.client.topics.includes(topic))
      return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that topic. Please use \`\`!topics\`\` to see a list.`);
    const path = __basedir + '/data/trivia/' + topic + '.txt';
    const topics = fs.readFileSync(path).toString().split('\n');
    let count = topics.length;
    const n = Math.floor(Math.random() * count);
    const question = topics[n].split('`').shift();
    let answers = topics[n].split('`');
    let realAnswers = '';
    answers.shift();
    for (let i = 0; i < answers.length; i++){
      realAnswers = realAnswers + ' | ' + answers[i];
      answers[i] = answers[i].trim().toLowerCase().replace(/\s/g, '');
    }
    realAnswers = '**' + realAnswers.slice(2) + '**';
    if (randomPick) message.channel.send('From **' + topic + '**: ' + question);
    else message.channel.send(question);
    let winner;
    const collector = new Discord.MessageCollector(message.channel, m => {
      if (!m.author.bot) return true;
    }, { time: 10000 });
    collector.on('collect', msg => {
      if (answers.includes(msg.content.toLowerCase().replace(/\s/g, ''))) {
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
