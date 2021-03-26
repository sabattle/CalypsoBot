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

  let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
  if (channel) {
    args.shift();
  } else channel = message.channel;
  
    if(!args.length) return this.sendErrorMessage(message, 0, "Input something to reverse lmao");
 
    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to send messages in the provided channel');

      if (!channel.permissionsFor(message.member).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'You do not have permission to send messages in the provided channel');

   const msg = (args.join(" ").split("").reverse().join(""));
  return channel.send(msg, { disableMentions: 'everyone' });

  }
}
