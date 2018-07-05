module.exports = (client, oldMember, newMember) => {
  if (oldMember.presence.game){
    if (oldMember.presence.game.streaming === true) return;
  }
  if (newMember.presence.game){
    if (newMember.presence.game.streaming === true) client.channels.get(client.defaultChannelID).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
  }
}
