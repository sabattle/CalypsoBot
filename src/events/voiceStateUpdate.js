module.exports = (client, oldMember, newMember) => {
  
  // Get disabled commands
  let disabledCommands = client.db.settings.selectDisabledCommands.pluck().get(oldMember.guild.id) || [];
  if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

  // Check if points are disabled
  const commands = client.commands.array().filter(c => c.type === 'point' && !disabledCommands.includes(c.name));
  if (commands.length === 0) return;

  const voicePoints = client.db.settings.selectVoicePoints.pluck().get(newMember.guild.id);
  if (voicePoints == 0) return;

  // Set IDs
  const oldId = oldMember.voiceChannelID;
  const newId = newMember.voiceChannelID;
  const afkId = newMember.guild.afkChannelID;

  if (oldId === newId) return;
  else if ((!oldId || oldId === afkId) && newId && newId !== afkId) { // Joining channel that is not AFK
    newMember.interval = setInterval(() => {
      client.db.users.updatePoints.run({ points: voicePoints }, newMember.id, newMember.guild.id);
    }, 60000);
  } else if (oldId && (oldId !== afkId && !newId || newId === afkId)) { // Leaving voice chat or joining AFK
    clearInterval(oldMember.interval);
  }
};