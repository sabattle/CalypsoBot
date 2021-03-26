const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class SpotifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'spotify',
      aliases: ['spy'],
      usage: 'spotify',
      description: 'shows info about someone who is listening to spotify',
      type: client.types.FUN,
      examples: ['spotify @User']
    });
  }
     async run (message, args) {
      let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args.join(' ').toLocaleLowerCase()) || message.member;
  
      if (!user.presence.activities.length) {
        return this.sendErrorMessage(message, 0, "User isnt listening to spotify")
      }
       
      if (user.presence.activity.type === 'LISTENING' && activity.name === 'Spotify' && activity.assets !== null) {

        let trackIMG = `https://i.scdn.co/image/${activity.assets.largeImage.slice(8)}`;
        let trackURL = `https://open.spotify.com/track/${activity.syncID}`;
        let trackName = activity.details;
        let trackAuthor = activity.state;
        let trackAlbum = activity.assets.largeText;
        trackAuthor = trackAuthor.replace(/;/g, ",")

        const embed = new MessageEmbed()
        .setAuthor('Spotify Track Info', 'https://cdn.discordapp.com/emojis/408668371039682560.png')
        .setColor("GREEN")
        .setThumbnail(trackIMG)
        .addField('Song Name', trackName, true)
        .addField('Album', trackAlbum, true)
        .addField('Author', trackAuthor, false)
        .addField('Listen to Track', `${trackURL}`, false)
        .setTimestamp()
        .setFooter(user.displayName, user.user.displayAvatarURL({ dynamic: true }))
        message.channel.send(embed);
        }
    }}