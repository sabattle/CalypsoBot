const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class UrbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'urban',
      usage: 'urban <query>',
      description: 'Displays a page in urban dictonary.',
      type: client.types.INFO,
    });
  }
 async run(message, args) {
    if (!args.length) return this.sendErrorMessage(message, 0, 'You need to supply a search term!'); 

    //return it as urban command may return NSFW results
    if (!message.channel.nsfw) return this.sendErrorMessage(message, 0, "Please try this command again in a NSFW channel")

    const query = encodeURIComponent(args.join(' ')); //encode the args to fetch info from urban dictionary

    const { list } = await fetch(`https://api.urbandictionary.com/v0/define?term=${query}`).then(response => response.json());

    if (!list.length) return this.sendErrorMessage(message, 0, `No results found for ${args.join(' ')}.`);

    const [answer] = list;

    const embed = new MessageEmbed()
        .setColor(message.guild.me.displayHexColor)
        .setTitle(answer.word)
        .setURL(answer.permalink)
        .addFields(
            { name: 'Definition', value: (answer.definition) },
            { name: 'Example', value: (answer.example) },
            { name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
        );
    message.channel.send(embed);
 }
}