module.exports = (client, oldMember, newMember) => {
  if (newMember.presence.game && oldMember.presence.game){
    if (newMember.presence.game.streaming === true && oldMember.presence.game.streaming === false)
      client.channels.get(client.channels.first).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
  }
  else if (newMember.presence.game){
    if (newMember.presence.game.streaming)
      client.channels.get(client.channels.first).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
  }
};
