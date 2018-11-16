module.exports = {
  name: 'crown',
  usage: '',
  description: 'Fetches the name of your server\'s crown role.',
  tag: 'fun',
  run: (message) => {
    try {
      const row = message.client.getRow.get(message.guild.id);
      if (row.crownRole === 'none') message.channel.send('There is currently no crown role on this server.');
      else message.channel.send(`The name of this server's crown role is: **${row.crownRole}**`);
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of this server\'s crown role. Has a server administrator ran ``!setup``?');
    }
  }
};
