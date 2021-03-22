const Command = require('../Command.js');

module.exports = class SearchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'search',
      aliases: ['sch'],
      usage: 'search closer',
      description: 'searches a song',
      type: client.types.MUSIC
    });
  }

  async run (client, message, args)  {
    if (!message.member.voice.channel)
      return this.sendErrorMessage(message, 0, "join a voice channel first");
    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return this.sendErrorMessage(message, 0, "We're not in same channel");

    client.player.play(message, args.join(" "));
  }
};