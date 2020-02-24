module.exports = (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;

  // Command handler
  let command;
  const prefix = client.db.guildSettings.selectPrefix.pluck().get(message.guild.id);
  if (message.content.startsWith(prefix)){
    const args = message.content.trim().split(/ +/g);
    const cmd = args.shift().slice(prefix.length).toLowerCase();
    command = client.commands.get(cmd);
    if (!command) command = client.aliases.get(cmd); // If command not found, check aliases
    if (command) command.run(message, args);
  }
};
