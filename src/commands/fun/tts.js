const Command = require('../Command.js');
const request = require("node-superfetch");


module.exports = class TtsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'tts',
      aliases: ['texttospeech'],
      usage: 'tts <text>',
      description: '',
      type: client.types.FUN,
      examples: ['text hello world']
    });
  }
     async run (message, args) {
        if (!args[0])
        return this.sendErrorMessage(message, 0, "Missing text to convert!");
      let text = args.join(" ");
      let serverQueue = this.client.player.getQueue(message);
      if (text.length > 1024)
        return this.sendErrorMessage(message, 0, "text should be less than 1024 characters");
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return this.sendErrorMessage(message, 0, "Join a VoiceChannel First!");
      if (
        !voiceChannel
          .permissionsFor(message.client.user)
          .has(["CONNECT", "SPEAK"])
      ) {
        return this.sendErrorMessage(message, 0, "Missing permissions Connect/Speak!");
      }
      if (serverQueue) return message.channel.send("**Cannot Play TTS While Music Is Being Played!**")
      if (!voiceChannel.joinable)
        return this.sendErrorMessage(message, 0, "I cannot join voicechannel");
      if (this.client.voice.connections.has(voiceChannel.guild.id))
        return this.sendErrorMessage(message, 0, "A tts conversion is going on ;(");
      try {
        const connection = await voiceChannel.join();
        const { url } = await request
          .get("http://tts.cyzon.us/tts")
          .query({ text });
        const dispatcher = connection.play(url);
        await message.react("🔉");
        dispatcher.once("finish", () => voiceChannel.leave());
        dispatcher.once("error", () => voiceChannel.leave());
        return null;
      } catch (err) {
        voiceChannel.leave();
        console.log(err)
        return this.sendErrorMessage(message, 0, "Oh-no, an Error occured.");
      }
    }
  };