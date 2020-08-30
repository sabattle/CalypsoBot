const Command = require('../Command.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      usage: 'say [channel mention/ID] <message>',
      description: oneLine`
        Sends a message to the specified channel. 
        If no channel is given, then the message will be sent to the current channel.
      `,
      type: client.types.FUN,
      examples: ['say #general hello world']
    });
  }
  run(message, args) {
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Please mention an accessible text channel or provide a valid text channel ID
    `);

    // Get mod channels
    let modChannelIds = message.client.db.settings.selectModChannelIds.pluck().get(message.guild.id) || [];
    if (typeof(modChannelIds) === 'string') modChannelIds = modChannelIds.split(' ');
    if (modChannelIds.includes(channel.id)) return this.sendErrorMessage(message, 0, stripIndent`
      Provided channel is moderator only, please mention an accessible text channel or provide a valid text channel ID
    `);

    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a message for me to say');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to send messages in the provided channel');

    if (!channel.permissionsFor(message.member).has(['SEND_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'You do not have permission to send messages in the provided channel');

    const msg = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    channel.send(msg, { disableMentions: 'everyone' });
  } 
};