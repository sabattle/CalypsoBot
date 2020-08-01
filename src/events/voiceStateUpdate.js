module.exports = (client, oldMember, newMember) => {
  
  // Get points
  const { point_tracking: pointTracking, voice_points: voicePoints } = 
    client.db.settings.selectPoints.get(newMember.guild.id);
  if (!pointTracking || voicePoints == 0) return;

  // Set IDs
  const oldId = oldMember.voiceChannelID;
  const newId = newMember.voiceChannelID;
  const afkId = newMember.guild.afkChannelID;

  if (oldId === newId) return;
  else if ((!oldId || oldId === afkId) && newId && newId !== afkId) { // Joining channel that is not AFK
    newMember.interval = setInterval(() => {
      client.db.users.updatePoints.run({ points: voicePoints }, newMember.id, newMember.guild.id);
    }, 5000);
  } else if (oldId && (oldId !== afkId && !newId || newId === afkId)) { // Leaving voice chat or joining AFK
    clearInterval(oldMember.interval);
  }
};