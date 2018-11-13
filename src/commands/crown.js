module.exports = {
  name: 'crown',
  usage: '',
  description: 'Fetches the name of your server\'s crown role.',
  tag: 'general',
  run: (message) => {
    let row;
    try {
      row = message.client.getRow.get(message.guild.id);
      if (row.member === 'none') message.channel.send('There is currently no crown role on this server.');
      else message.channel.send(`This server's crown role is: **${row.crown}**`);
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of this server\'s crown role. Has a server administrator ran ``!setup``?');
    }
  }
};
