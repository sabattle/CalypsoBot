const Command = require('../Command.js');
const Discord = require('discord.js');
const canvacord = require('canvacord')

module.exports = class CommentCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'comment',
        aliases: ['cmt', 'ytcomment'],
        usage: 'comment <message>',
        description: 'Post a youtube comment.',
        type: client.types.FUN
      });
    }
  
    async run (message, args) {

    // Get message
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a message to tweet');
    let tweet = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    if (tweet.length > 68) tweet = tweet.slice(0, 65) + '...';

    try {
        let yt = await canvacord.Canvas.youtube({"avatar":message.author.displayAvatarURL({format: "png"}),"username":message.author.username, "content":args.join(" ")})
        let attachment = new Discord.MessageAttachment(yt, 'comment.png')
        message.channel.send(attachment)
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};