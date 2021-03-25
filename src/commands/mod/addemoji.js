const Command = require('../Command.js');
const Discord = require("discord.js");
const { parse } = require("twemoji-parser");

module.exports = class AddEmojiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addemoji',
      aliases: ['steal', 'aem'],
      usage: 'addemoji [:emoji: | link] <name of emoji to be saved.>',
      description: 'Add any of your preferred emoji from any server to your server.',
      type: client.types.MOD,
      clientPermissions: ['MANAGE_EMOJIS'],
      userPermissions: ['MANAGE_EMOJIS'],
      examples: ['addemoji <:peperip:797063171789160458>']
    });
  }
async run(message, args){
  try {
      let name;
      const urlRegex = new RegExp(/^(ftp|http|https):\/\/[^ "]+$/)

      const emoji = args[0];
      if (!emoji) this.sendErrorMessage(message, 0, 'Please mention a valid emoji.'); 
      
      let customemoji = Discord.Util.parseEmoji(emoji) //Check if it's a emoji
  
      if (customemoji.id) {
        const Link = `https://cdn.discordapp.com/emojis/${customemoji.id}.${
          customemoji.animated ? "gif" : "png"
        }`
        name = args.slice(1).join("_")
       const emoji = await message.guild.emojis.create(
          `${Link}`,
          `${name || `${customemoji.name}`}`
        );
        return message.channel.send(`${emoji} added with name "${customemoji.name}"`);
      } else if (urlRegex.test(args[0])) { //check for image urls
        name = args.slice(1).join("_") || Math.random().toString(36).slice(2) //make the name compatible or just choose a random string
        const addedEmoji = await message.guild.emojis.create(
          `${emoji}`,
          `${name || `${customemoji.name}`}`
        );
        return message.channel.send(`${addedEmoji} added with name "${addedEmoji.name}"`);
        } else {
        let CheckEmoji = parse(emoji, { assetType: "png" });
        if (!CheckEmoji[0])
          return this.sendErrorMessage(message, 0, 'Please mention a valid emoji.'); 
      }
    } catch (err) {
      this.client.logger.error(err)
      this.sendErrorMessage(message, 1, 'A error occured while adding the emoji. Common reasons are:- unallowed characters in emoji name, 50 emoji limit.', err)
    }
 }
}