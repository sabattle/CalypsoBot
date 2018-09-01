const fs = require('fs');

module.exports = (client) => {
  fs.readdir('./src/events/', (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No events found.');
    console.log(`${files.length} event(s) found...`);
    files.forEach(f => {
      let eventName = f.substring(0, f.indexOf('.'));
      let event =  require(`./events/${f}`);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(`./events/${f}`)];
      console.log(`Loading event: ${eventName}.`);
    });
  });
}
