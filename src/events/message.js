const sqlite = require('sqlite');
sqlite.open('./data/db.sqlite');

module.exports = async (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;
  //command handler
  if (message.content.charAt(0) === client.prefix){
    let args = message.content.trim().split(/ +/g);
    let command = client.commands.get(args.shift().slice(client.prefix.length).toLowerCase());
    if (command) command.run(message, args);
  }
  else {
    let reaction = client.reactions.find('prompt', message.content);
    if (reaction) reaction.run(message);
  }
  //database
  try {
    let row = await sqlite.get(`SELECT * FROM db WHERE userId ='${message.author.id}'`);
    if (!row) sqlite.run('INSERT INTO db (userId, points) VALUES (?, ?)', [message.author.id, 1]);
    else sqlite.run(`UPDATE db SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
  }
  catch(err) {
    console.log(err.message);
    await sqlite.run('CREATE TABLE IF NOT EXISTS db (userId TEXT, points INTEGER)');
    sqlite.run('INSERT INTO db (userId, points) VALUES (?, ?)', [message.author.id, 1]);
  }
}
