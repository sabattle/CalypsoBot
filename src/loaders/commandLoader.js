const fs = require('fs');
const path = __basedir + '/src/commands/';

module.exports = (client) => {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No commands found');
    console.log(`${files.length} command(s) found...`);
    files.forEach(f => {
      const command = require(path + f);
      console.log(`Loading command: ${command.name}`);
      client.commands.set(command.name, command);
    });
  });
};
