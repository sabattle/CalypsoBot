const Command = require('../Command.js');

module.exports = class ReverseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reverse',
      aliases: ['rse'],
      usage: 'reverse hello',
      description: 'Send\'s text inverted',
      type: client.types.FUN
    });
  }

run(message, args) {
    if(!args.length) return this.sendErrorMessage(message, 0, "Input something to reverse lmao");
    return message.channel.send(args.join(" ").split("").reverse().join(""));
  }
}
