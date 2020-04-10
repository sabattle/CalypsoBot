const Command = require('../Command.js');
const Discord = require('discord.js');
const search = require('youtube-search');
const he = require('he');

module.exports = class YoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      aliases: ['yt'],
      usage: '<VIDEO NAME>',
      description: 'Searches YouTube for the specified video.',
      type: 'fun'
    });
  }
  async run(message, args) {
    const apiKey = message.client.apiKeys.googleApi;
    const videoName = args.join(' ');
    if (!videoName) return message.channel.send(`${message.member}, please provide a YouTube video name.`);
    let result = await search(videoName, { maxResults: 1, key: apiKey, type: 'video' })
      .catch(err => {
        message.client.logger.error(err);
        return message.channel.send(`Sorry ${message.member}, something went wrong. Please try again later.`);
      });
    result = result.results[0];
    if (!result) return message.channel.send(`Sorry ${message.member}, I was unable to find that video.`);
    const decodedTitle = he.decode(result.title);
    const embed = new Discord.RichEmbed()
      .setTitle(decodedTitle)
      .setURL(result.link)
      .setDescription(result.description)
      .setThumbnail(result.thumbnails.default.url);
    message.channel.send(embed);
  }
};
