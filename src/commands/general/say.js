const Command = require('../Command.js');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: '<CHANNEL MENTION> <MESSAGE>',
      description: 'Sends a message to the specified channel (or the current channel, if none is specified).',
      type: 'general'
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
    if (!msg) message.channel.send(`${message.member}, please provide a message for me to say.`);
    else channel.send(msg);
  } 
};