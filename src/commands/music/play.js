const Command = require('../Command.js');

module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['p'],
      usage: 'play closer',
      description: 'plays a song',
      type: client.types.MUSIC
    });
  }

    async run (message, args) {
    if (!message.member.voice.channel)
return this.sendErrorMessage(message, 0, "Please join a voice channel to play music.")
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return this.sendErrorMessage(message, 0, "Please join the same voice channel as me.")

      const queue = this.client.player.getQueue(message);
    this.client.player.play(message, args.join(" "), { firstResult: true });
    return message.channel.send(`[${queue.tracks[0].title}](${queue.tracks[0].url})\n*Requested by ${queue.tracks[0].requestedBy}*\n`)
  }
}