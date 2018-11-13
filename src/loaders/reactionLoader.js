const fs = require('fs');
const path = __basedir + '/src/reactions/';

module.exports = (client) => {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No reactions found.');
    console.log(`${files.length} reaction(s) found...`);
    files.forEach(f => {
      const reaction = require(path + f);
      console.log(`Loading reaction: ${reaction.name}.`);
      client.reactions.set(reaction.name, reaction);
    });
  });
};
