module.exports = (client, oldMember, newMember) => {
  
  // Check if points enabled
  const pointsEnabled = client.db.guildSettings.selectPointsEnabled.pluck().get(newMember.guild.id);
  const voicePoints = client.db.guildSettings.selectVoicePoints.pluck().get(newMember.guild.id);
  if (!pointsEnabled || voicePoints == 0) return;

  // Set IDs
  const oldId = oldMember.voiceChannelID;
  const newId = newMember.voiceChannelID;
  const afkId = newMember.guild.afkChannelID;

  if (oldId === newId) return;
  else if ((!oldId || oldId === afkId) && newId && newId !== afkId) { // Joining channel that is not AFK
    newMember.interval = setInterval(() => {
      client.db.guildPoints.updatePoints.run({ points: voicePoints }, newMember.id, newMember.guild.id);
    }, 60000);
  } else if (oldId && (oldId !== afkId && !newId || newId === afkId)) { // Leaving voice chat or joining AFK
    clearInterval(oldMember.interval);
  }
};