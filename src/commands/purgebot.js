module.exports = {
  name: 'purgebot',
  usage: '<MESSAGE COUNT>',
  description: 'Sifts through the specified amount of messages and deletes any commands or messages from Calypso (limit is 50 at a time).',
  tag: 'mod',
  run: async (message, args) => {
    if (message.member.hasPermission('MANAGE_MESSAGES')){
      if (message.guild.me.hasPermission('MANAGE_MESSAGES')){
        const amount = parseInt(args.join());
        if (isNaN(amount) === true || !amount || amount <= 0 || amount > 50) return message.channel.send(`${message.member}, please enter a number between 1 and 50.`);
        await message.delete();
        let messages = await message.channel.fetchMessages({limit: amount});
        messages = messages.array().filter(msg => { // filter for commands or bot messages
          const command = message.client.commands.get(msg.content.trim().split(/ +/g).shift().slice(message.client.prefix.length).toLowerCase());
          if (msg.author.bot || command) return true;
        });
        messages.forEach(async msg => {
          await msg.delete();
        });
        message.channel.send(`I found **${messages.length}** messages (this message will be removed after 5s).`).then(msg => {
          msg.delete(5000);
        });
        console.log(`${message.member.displayName} used purgebot in ${message.channel.name}`);
      }
      else message.channel.send('I require the **Manage Messages** permission for this command.');
    }
    else message.channel.send(`${message.member}, you need the **Manage Messages** permission to use this command.`);
  }
};
