const Command = require('../Command.js');
Discord = require("discord.js"),
cheerio = require("cheerio"),
fetch = require("node-fetch");

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      aliases: ['ly'],
      usage: 'lyrics closer',
      description: 'finds lyrics to a song',
      type: client.types.MUSIC
    });
  }

async run (message, args)  {
    
  const songName = args.join(" ");
  if(!songName){
    return this.sendErrorMessage(message, 0, "Input a song name to find lyrics");
  }
      
  const embed = new Discord.MessageEmbed()
    .setAuthor(`${songName}'s Lyrics`)
    .setColor('RANDOM')
    .setFooter("lyrics provided by cheerio npm");

  try {

    const songNameFormated = songName
      .toLowerCase()
      .replace(/\(lyrics|lyric|official music video|audio|official|official video|official video hd|clip officiel|clip|extended|hq\)/g, "")
      .split(" ").join("%20");

    let res = await fetch(`https://www.musixmatch.com/search/${songNameFormated}`);
    res = await res.text();
    let $ = await cheerio.load(res);
    const songLink = `https://musixmatch.com${$("h2[class=\"media-card-title\"]").find("a").attr("href")}`;

    res = await fetch(songLink);
    res = await res.text();
    $ = await cheerio.load(res);

    let lyrics = await $("p[class=\"mxm-lyrics__content \"]").text();

    if(lyrics.length > 2048) {
      lyrics = lyrics.substr(0, 2031), "+"`https://www.musixmatch.com/search/${songName}`;
    } else if(!lyrics.length) {
      return this.sendErrorMessage("an error  occured, No lyrics found for your query :(");
    }

    embed.setDescription(lyrics);
    message.channel.send(embed);

  } catch(e){
    message.channel.send({
      embed: {
        color: 'RANDOM',
        description: `an error  occured, No lyrics found for your query \`${songName}\``
      }
    });
  }

}}