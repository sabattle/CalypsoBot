module.exports = {
  name: 'findid',
  usage: '<USER MENTION | TEXT CHANNEL>',
  description: 'Finds the ID of the mentioned user or text channel',
  tag: 'general',
  run: (message) => {
    const target = message.mentions.members.first() || message.mentions.channels.first();
    if (!target) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that. Please mention a user or a text channel.`);
    const id = target.id;
    message.channel.send(`The ID for ${target} is **${id}**.`);
  }
};
