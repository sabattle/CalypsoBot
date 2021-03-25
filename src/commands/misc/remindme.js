const Command = require('../Command.js');
const ms = require('ms');

module.exports = class ReminderCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remindme",
      aliases: ['remind'],
      description: "Sets a reminder for you with the given time.",
      usage: "reminder <Time (h | min | sec)> <Text>",
      type: client.types.MISC
    });
  }
  
  async run(message, args) { 
    try {
      let reminderTime = args[0];

      if (!reminderTime.length) {
        return message.reply("Command Usage: `reminder <Time (h | min | sec)> <Text>`")
      }

      let reminder = args.slice(1).join(" "); 

      message.channel.send(`**Alright**, ${message.author.username}! I will remind you about **${reminder}** in **${reminderTime}**!`); 

      setTimeout(function() {
        message.reply(`you wanted me to remind you about: ${reminder}`);
      }, ms(reminderTime));
    } catch (err) {
      return message.reply(`Oh no, an error occurred: \`${err.message}\`.`);
    }
  }
} 