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
  let userId = message.author.id, guild = message.guild;
  if (message.channel.id != client.devChannelID) require('../updatePoints.js')(userId, guild);
}
