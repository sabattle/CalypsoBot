module.exports = {
  name: 'purgebot',
  usage: '<MESSAGE COUNT>',
  description: 'Sifts through the specified amount of messages and deletes any commands or messages from Calypso (limit is 100 at a time).',
  tag: 'admin',
  run: async (message, args) => {
    if (message.member.roles.find('name', 'Admin')) {
      let amount = args.join();
      if (isNaN(amount) === true) return message.channel.send('Please enter a number between 1 and 100.');
      if (!amount || amount > 100) amount = 100;
      let messages = await message.channel.fetchMessages({limit: amount + 1});
      messages = messages.array().filter(m => {
        let command = message.client.commands.get(m.content.trim().split(/ +/g).shift().slice(message.client.prefix.length).toLowerCase());
        if (m.author.client || command) return true;
      });
      message.channel.bulkDelete(messages);
      console.log(`${message.member.displayName} used purgebot in ${message.channel.name}.`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to use this command!`);
  }
}
