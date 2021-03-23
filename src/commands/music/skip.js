const Command = require('../Command.js');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['sk'],
      usage: 'skip',
      description: 'skips a song',
      type: client.types.MUSIC
    });
  }

  async run (client, message, args) {

if (!message.member.voice.channel)
  return this.sendErrorMessage(message, 0, "Join a voicechannel first")
if (
message.guild.me.voice.channel &&
message.member.voice.channel.id !== message.guild.me.voice.channel.id
)
return this.sendErrorMessage(message, 0, "We are not in the same voice channel.")

if (!client.player.getQueue(message))
return this.sendErrorMessage(message, 0, "Queue and player were empty.")

const success = message.client.player.skip(message);

if (success)
message.channel.send("⏯️ **Skipped**");
}
};