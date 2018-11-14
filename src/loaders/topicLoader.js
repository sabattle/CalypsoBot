const fs = require('fs');
const path = __basedir + '/data/trivia/';

module.exports = (client) => {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'txt');
    if (files.length === 0) return console.log('No topics found.');
    console.log(`${files.length} topic(s) found...`);
    files.forEach(topic => {
      const t = topic.split('.').shift();
      console.log(`Loading topic: ${t}.`);
      client.topics.push(t);
    });
  });
};
