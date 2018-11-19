module.exports = {
  name: 'crown',
  usage: '',
  description: 'Fetches the name of your server\'s crown role.',
  tag: 'fun',
  run: (message) => {
    try {
      const config = message.client.getConfig.get(message.guild.id);
      if (config.crownRole === 'none') message.channel.send('There is currently no crown role on this server.');
      else message.channel.send(`The name of this server's crown role is: **${config.crownRole}**.`);
    }
    catch (err) {
      return message.channel.send(`Sorry ${message.member}, I don't know the name of this server's crown role. Has a server administrator ran \`\`!setup\`\`?`);
    }
  }
};
