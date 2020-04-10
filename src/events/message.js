module.exports = (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;

  // Check if points enabled
  const pointsEnabled = client.db.guildSettings.selectUsePoints.pluck().get(message.guild.id);

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
        if (command.type === 'point' && !pointsEnabled) {
          return message.channel.send('Points are currently **disabled** on this server.');

        // Update points with commandPoints value  
        } else if (pointsEnabled) {
          const commandPoints = client.db.guildSettings.selectCommandPoints.pluck().get(message.guild.id);
          client.db.guildPoints.updatePoints.run({ points: commandPoints }, message.author.id, message.guild.id);
        }
        return command.run(message, args); // Run command
      }
    } 
  }

  // Update points with messagePoints value
  if (pointsEnabled) {  
    const messagePoints = client.db.guildSettings.selectMessagePoints.pluck().get(message.guild.id);
    client.db.guildPoints.updatePoints.run({ points: messagePoints }, message.author.id, message.guild.id);
  }
};

