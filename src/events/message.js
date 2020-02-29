module.exports = (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;

  // Points
  const enabled = client.db.guildSettings.selectUsePoints.pluck().get(message.guild.id);
  if (enabled) client.db.guildPoints.updatePoints.run({ points: 1 }, message.author.id, message.guild.id);

  // Command handler
  let command;
  const prefix = client.db.guildSettings.selectPrefix.pluck().get(message.guild.id);
  if (message.content.startsWith(prefix)){
    const args = message.content.trim().split(/ +/g);
    const cmd = args.shift().slice(prefix.length).toLowerCase();
    command = client.commands.get(cmd);
    if (!command) command = client.aliases.get(cmd); // If command not found, check aliases
    if (command) {
      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {
        // Check command type     
        if (command.type === 'point') {
          if (!enabled) return message.channel.send('Points are currently **disabled** on this server.');
        }
        command.run(message, args);
      }
    }
  }
};
