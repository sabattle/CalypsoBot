const Command = require('../Command.js');
const { oneLine } = require('common-tags');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: 'say [channel mention/ID] <message>',
      description: oneLine`
        Sends a message to the specified channel. 
        If no channel is given, then the message will be sent to the current channel.
      `,
      type: 'fun',
      examples: ['say #general hello world']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;
    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    if (!msg) this.sendErrorMessage(message, 'No message provided. Please provide a message for me to say.');
    else channel.send(msg);
  } 
};