const Command = require('../Command.js');
const Discord = require('discord.js')

module.exports = class NowplayingCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nowplaying',
      aliases: ['np'],
      usage: 'nowplaying',
      description: 'displays info about the current track.',
      type: client.types.MUSIC
    });
  }

async run (message, client) {

    const queue = this.client.player.getQueue(message);

    const voice = message.member.voice.channel;
    if (!voice){
        return this.sendErrorMessage(message,0,"Join a voice channel first");
    }

    if(!queue){
        return this.sendErrorMessage(message,0,"player is empty, add some songs and retry");
    }

    // Gets the current song
    const track = await this.client.player.nowPlaying(message);

    // Generate discord embed to display song informations
    const embed = new Discord.MessageEmbed()
        .setAuthor('Now Playing')
        .setThumbnail(track.thumbnail)
        .addField('Title', track.title, true)
        .addField('Author', track.author, false)
        .addField('Length', track.duration, true)
        .addField('Views',track.views, true)
        .addField('volume', this.client.player.getQueue(message).volume, true)
        .addField('Link', `[${track.title}](${track.url})`, true)
        .addField("\u200B", this.client.player.createProgressBar(message, { timecodes: true }))
        .setTimestamp()
        .setColor('RANDOM')
        .setFooter('music system');
    
    // Send the embed in the current channel
    message.channel.send(embed);
    
}}