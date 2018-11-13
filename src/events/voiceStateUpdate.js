
const moment = require('moment');
const updatePoints = require(__basedir + '/src/utils/updatePoints.js');

module.exports = (client, oldMember, newMember) => {
  if (oldMember.voiceChannelID === newMember.voiceChannelID) return; // ignore mutes
  else if (oldMember.voiceChannelID === oldMember.guild.afkChannelID && !newMember.voiceChannelID) return; // ignore leaving afk
  else if (oldMember.voiceChannelID === oldMember.guild.afkChannelID && newMember.voiceChannelID) { // join channel from afk
    client.startTimes.set(oldMember.id, moment());
  }
  else if (newMember.voiceChannelID === newMember.guild.afkChannelID) { // join afk channel
    try {
      const startTime = client.startTimes.get(oldMember.id);
      const endTime = moment();
      const diff = startTime.diff(endTime, 'minutes') * -1;
      updatePoints(client, oldMember.id, oldMember.guild.name, diff);
    }
    catch (err){
      console.log('Unable to add points from voice time.');
    }
  }
  else if (!oldMember.voiceChannelID && newMember.voiceChannelID) { // join channel
    client.startTimes.set(oldMember.id, moment());
  }
  else if (oldMember.voiceChannelID && !newMember.voiceChannelID) { // leave channel
    try {
      const startTime = client.startTimes.get(oldMember.id);
      const endTime = moment();
      const diff = startTime.diff(endTime, 'minutes') * -1;
      updatePoints(client, oldMember.id, oldMember.guild.name, diff);
    }
    catch (err){
      console.log('Unable to add points from voice time.');
    }
  }
};
