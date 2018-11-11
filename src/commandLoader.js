const fs = require('fs');

module.exports = (client) => {
  fs.readdir('./src/commands/', (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No commands found.');
    console.log(`${files.length} command(s) found...`);
    files.forEach(f => {
      let command = require(`./commands/${f}`);
      console.log(`Loading command: ${command.name}.`);
      client.commands.set(command.name, command);
    });
  });
};
