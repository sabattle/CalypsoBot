const Command = require('../Command.js');
const lyricsFinder = require("lyrics-finder");

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      aliases: ['ly'],
      usage: 'play closer',
      description: 'finds lyrics to a song',
      type: client.types.MUSIC
    });
  }

async run (client, message, args)  {
    let lyrics = null;
const prefix = message.client.db.settings.selectPrefix.pluck().get(message.guild.id); // Get prefix
    if (!client.player.getQueue(message))
      return message.sendError(
        "No Music is Playing.",
        "Please join a voice channel to play music."
      );

    let track = args[0];
    if (!args.length) {
      track = (client.player.getQueue(message)).playing
    }
    try {
      if (!args.length) {
        lyrics = await lyricsFinder(track.title, "");
      } else if ((track = args[0])) {
        lyrics = await lyricsFinder(args[0], "");
      }
      if ((track = message.client.player.nowPlaying(message) && !lyrics)) {
        message.sendError(
          "No Lyrics Found.",
          "No lyrics were found for **" +
            track.title +
            "**. Try looking for the lyrics yourself by doing `" +
            prefix +
            "lyrics {Your song}`."
        );
      } else if ((track = args[0] && !lyrics)) {
        return message.sendError(
          "No Lyrics Found.",
          "No lyrics were found for **" +
            track +
            "**. Try looking for the lyrics yourself by doing `" +
            prefix +
            "lyrics {Your song}`."
        );
      }
    } catch (error) {
      message.sendError(
        "No Lyrics Found.",
        "No lyrics were found for **" +
          track +
          "**. Try looking for the lyrics yourself by doing `" +
          prefix +
          "lyrics {Your song}`."
      );
    }
    if ((track = (client.player.getQueue(message)).playing)) {
      const lyricsEmbed = new MessageEmbed()
        .setAuthor(
          'Lyrics for '+ track.title,
          "https://raw.githubusercontent.com/HurricanoBot/HurricanoImages/master/SetAuthorEmojis/Music.gif"
        )
        .setURL(track.url)
        .setDescription(lyrics)
        .setFooter(
          `Requested by ${message.author.username}`,
          message.author.displayAvatarURL()
        )
        .setThumbnail(track.thumbnail);
        
        if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      return message.channel.send(lyricsEmbed).catch(console.error);
    } else if ((track = args[0])) {
      const lyricsEmbed = new MessageEmbed()
        .setAuthor(
          `Lyrics found for ${args[0]}`,
          "https://raw.githubusercontent.com/HurricanoBot/HurricanoImages/master/SetAuthorEmojis/Music.gif"
        )
        .setDescription(lyrics)
        .setFooter(
          `Requested by ${message.author.username}`,
          message.author.displayAvatarURL()
        );
        if (lyricsEmbed.description.length >= 2048)
        lyricsEmbed.description = `${lyricsEmbed.description.substr(0, 2045)}...`;
      return message.channel.send(lyricsEmbed).catch(console.error);
    }


  }
};