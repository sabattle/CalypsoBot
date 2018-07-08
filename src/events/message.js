const sqlite = require('sqlite');

module.exports = async (client, message) => {
  await sqlite.open(`./data/${message.guild.name}.sqlite`);
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
    let row = await sqlite.get(`SELECT * FROM score WHERE userId ='${message.author.id}'`);
    if (!row) sqlite.run(`INSERT INTO score (userId, points) VALUES (?, ?)`, [message.author.id, 1]);
    else sqlite.run(`UPDATE score SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
  }
  catch(err) {
    console.log(`Score table does not exist for ${message.guild.name}! Creating table...`);
    await sqlite.run(`CREATE TABLE IF NOT EXISTS score (userId TEXT, points INTEGER)`);
    sqlite.run(`INSERT INTO score (userId, points) VALUES (?, ?)`, [message.author.id, 1]);
  }
}
