const Command = require('../Command.js');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: 'say [channel mention] <message>',
      description: 'Sends a message to the specified channel (or the current channel, if none is specified).',
      type: 'general',
      examples: ['say #general hello world']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]);
    let msg;
    if (channel) {
      args.shift();
      msg = args.join(' ');
    } else {
      channel = message.channel;
      msg = args.join(' ');
    }
    if (!msg) this.sendErrorMessage(message, 'No message provided. Please provide a message for me to say.');
    else channel.send(msg);
  } 
};