const fs = require('fs');
const path = __basedir + '/src/events/';

module.exports = (client) => {
  fs.readdir(path, (err, files) => {
    if (err) console.error(err);
    files = files.filter(f => f.split('.').pop() === 'js');
    if (files.length === 0) return console.log('No events found');
    console.log(`${files.length} event(s) found...`);
    files.forEach(f => {
      const eventName = f.substring(0, f.indexOf('.'));
      const event =  require(path + f);
      client.on(eventName, event.bind(null, client));
      delete require.cache[require.resolve(path + f)];
      console.log(`Loading event: ${eventName}`);
    });
  });
};
