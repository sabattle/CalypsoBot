module.exports = function checkPointsDisabled(client, guild) {
  
  // Get disabled commands
  let disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(guild.id) || [];
  if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

  // Check if points are disabled
  const commands = client.commands.array().filter(c => c.type === 'point' && !disabledCommands.includes(c.name));
  if (commands.length === 0) return true;
  else return false;

};