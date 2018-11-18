module.exports = (client, oldMember, newMember) => {
  try {
    const config = client.getConfig.get(newMember.guild.id);
    if (config.defaultChannelID === 'none') return;
    if (newMember.presence.game && oldMember.presence.game){
      if (newMember.presence.game.streaming === true && oldMember.presence.game.streaming === false)
        client.channels.get(config.defaultChannelID).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
    }
    else if (newMember.presence.game){
      if (newMember.presence.game.streaming)
        client.channels.get(config.defaultChannelID).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
    }
  }
  catch (err) {
    return;
  }
};
