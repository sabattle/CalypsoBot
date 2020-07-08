const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const search = require('youtube-search');
const he = require('he');

module.exports = class YoutubeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'youtube',
      aliases: ['yt'],
      usage: 'youtube <video name>',
      description: 'Searches YouTube for the specified video.',
      type: types.FUN,
      examples: ['youtube That\'s a ten']
    });
  }
  async run(message, args) {
    const apiKey = message.client.apiKeys.googleApi;
    const videoName = args.join(' ');
    if (!videoName) return this.sendErrorMessage(message, 'Invalid Argument. Please provide a YouTube video name.');
    let result = await search(videoName, { maxResults: 1, key: apiKey, type: 'video' })
      .catch(err => {
        message.client.logger.error(err);
        return this.sendErrorMessage(message, 'Something went wrong. Please try again in a few seconds.', err.message);
      });
    result = result.results[0];
    if (!result) 
      return this.sendErrorMessage(message, 'Unable to find video. Please provide a different YouTube video name.');
    const decodedTitle = he.decode(result.title);
    const embed = new MessageEmbed()
      .setTitle(decodedTitle)
      .setURL(result.link)
      .setDescription(result.description)
      .setImage(result.thumbnails.high.url)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
