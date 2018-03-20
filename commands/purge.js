module.exports = {
  name: "purge",
  usage: "<MESSAGE COUNT>",
  description: "Deletes the specified amount of messages from a channel (limit is 100 at a time).",
  tag: "admin",
  run: async (bot, message, args) => {
    if (message.member.roles.find("name", "Admin")) {
      let amount = args.join();
      if (isNaN(amount) === true) return message.channel.send("Please enter a number between 1 and 100.");
      if (!amount || amount > 100) amount = 100;
      message.channel.bulkDelete(amount);
      console.log(`${message.member.displayName} used purge in ${message.channel.name}.`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to use this command!`);
  }
}
