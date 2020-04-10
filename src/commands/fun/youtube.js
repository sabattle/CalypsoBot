const Command = require('../Command.js');
const Discord = require('discord.js');
const search = require('youtube-search');

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
      .catch(err => message.client.logger.error(err));
    result = result.results[0];
    const embed = new Discord.RichEmbed()
      .setTitle(`${result.title}`)
      .setURL(`${result.link}`)
      .setDescription(`${result.description}`)
      .setThumbnail(`${result.thumbnails.default.url}`);
    message.channel.send(embed);
  }
};
