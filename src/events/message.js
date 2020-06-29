const sendInfo = require('../utils/sendInfo.js');

module.exports = (client, message) => {
  if (message.channel.type === 'dm' || message.author.bot) return;

  // Check if points enabled
  const pointsEnabled = client.db.guildSettings.selectEnablePoints.pluck().get(message.guild.id);

  // Command handler
  const prefix = client.db.guildSettings.selectPrefix.pluck().get(message.guild.id);
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
  if (!prefixRegex.test(message.content)) return;

  const [, match] = message.content.match(prefixRegex);
  const args = message.content.slice(match.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
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
  } else if (args.length == 0 && !message.content.startsWith(prefix)) {
    sendInfo(message);
  }

  // Update points with messagePoints value
  if (pointsEnabled) {  
    const messagePoints = client.db.guildSettings.selectMessagePoints.pluck().get(message.guild.id);
    client.db.guildPoints.updatePoints.run({ points: messagePoints }, message.author.id, message.guild.id);
  }
};

