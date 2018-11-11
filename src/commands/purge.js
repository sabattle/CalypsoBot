module.exports = {
  name: 'purge',
  usage: '<MESSAGE COUNT>',
  description: 'Deletes the specified amount of messages from a channel (limit is 50 at a time).',
  tag: 'admin',
  run: async (message, args) => {
    if (message.member.hasPermission('MANAGE_MESSAGES')) {
      let amount = parseInt(args.join());
      if (isNaN(amount) === true || !amount || amount <= 0 || amount > 50) return message.channel.send('Please enter a number between 1 and 50.');
      await message.delete(); // delete command message
      let messages = await message.channel.fetchMessages({limit: amount});
      messages.forEach(async msg => {
        await msg.delete();
      });
      console.log(`${message.member.displayName} used purge in ${message.channel.name}`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to use this command.`);
  }
};
