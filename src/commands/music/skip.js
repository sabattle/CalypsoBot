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
if (!message.member.voice.channel)
  return message.sendError(
    "Not in A Voice Channel.",
    "Please join a voice channel to play music."
  );
if (
message.guild.me.voice.channel &&
message.member.voice.channel.id !== message.guild.me.voice.channel.id
)
return message.sendError(
  "Different Voice Channel.",
  "Please join the same voice channel as me."
);

if (!client.player.getQueue(message))
return message.sendError(
  "No Music is Playing.",
  "Please join a voice channel to play music."
);

const success = message.client.player.skip(message);

if (success)
message.channel.send("Skipped.", "I have successfully skipped that song.");
}
};