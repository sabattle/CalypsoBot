const Command = require('../Command.js');
const Discord = require('discord.js');
const fs = require('fs');
const YAML = require('yaml');
const { oneLine } = require('common-tags');

module.exports = class TriviaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trivia',
      aliases: ['triv'],
      usage: '<TOPIC>',
      description: oneLine`
        Compete against your friends in a game of trivia (anyone can answer).
        If no topic is given, a random one will be chosen.
      `,
      type: 'fun'
    });
  }
  async run(message, args) {
    const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    let topic = args[0];
    let randomTopic = false;
    if (!topic) { // Pick a random topic if none given
      topic = message.client.topics[Math.floor(Math.random() * message.client.topics.length)];
      randomTopic = true;
    } else if (!message.client.topics.includes(topic))
      return message.channel.send(oneLine`
        Sorry ${message.member}, I don't recognize that topic. Please use \`\`${prefix}topics\`\` to see a list.
      `);
    
    // Get question and answers
    const path = __basedir + '/data/trivia/' + topic + '.yml';
    const questions = YAML.parse(fs.readFileSync(path, 'utf-8')).questions;
    const n = Math.floor(Math.random() * questions.length);
    const question = questions[n].question;
    const answers = questions[n].answers;
    const origAnswers = [...answers];
    // Clean answers
    for (let i = 0; i < answers.length; i++) {
      answers[i] = answers[i].trim().toLowerCase().replace(/\.|'|-|\s/g, '');
    }

    // Get user answer
    if (randomTopic) await message.channel.send(`From \`${topic}\`: ${question}`);
    else await message.channel.send(question);
    let winner;
    const collector = new Discord.MessageCollector(message.channel, msg => {
      if (!msg.author.bot) return true;
    }, { time: 10000 }); // Wait 10 seconds
    collector.on('collect', msg => {
      if (answers.includes(msg.content.trim().toLowerCase().replace(/\.|'|-|\s/g, ''))){
        winner = msg.author;
        collector.stop();
      }
    });
    collector.on('end', () => {
      if (winner) message.channel.send(`Congratulations ${winner}, you gave the correct answer!`);
      else message.channel.send(`
        Sorry ${message.member}, time's up! Better luck next time.\n\n**Correct answers**: ${origAnswers.join(', ')}
      `);
    });
  }
};
