const fs = require('fs');

module.exports = (client) => {
  fs.readdir('./src/reactions/', (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No reactions found.');
    console.log(`${files.length} reaction(s) found...`);
    files.forEach(f => {
      let reaction = require(`./reactions/${f}`);
      console.log(`Loading reaction: ${reaction.name}.`);
      client.reactions.set(reaction.name, reaction);
    });
  });
};
