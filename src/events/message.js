module.exports = async (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;
  //command handler
  let command;
  if (message.content.charAt(0) === client.prefix){
    let args = message.content.trim().split(/ +/g);
    command = client.commands.get(args.shift().slice(client.prefix.length).toLowerCase());
    if (command) command.run(message, args);
  }
  else {
    let reaction = client.reactions.find('prompt', message.content);
    if (reaction) reaction.run(message);
  }
  //points
  let userId = message.author.id, guild = message.guild;
  if (message.channel.id != client.devChannelID && !command) {
    if (message.content.includes('http')) require('../updatePoints.js')(userId, guild, 10);
    else if (message.attachments.size > 0) require('../updatePoints.js')(userId, guild, 20);
    else require('../updatePoints.js')(userId, guild);
  }
}
