const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const Discord = require("discord.js");
const { parse } = require("twemoji-parser");
module.exports = class AddEmojiCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addemoji',
      usage: 'addemoji [:emoji: | link] <name for the emoji to be saved>',
      description: 'Add any of your preferred emoji from any server to your server.',
      type: client.types.MOD,
      clientPermissions: ['MANAGE_EMOJIS'],
      userPermissions: ['MANAGE_EMOJIS'],
      examples: ['addemoji <:HOUSE_BRILLIANCE:761678113159512114> hypesquad brilliance']
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
        var Added = new MessageEmbed()
          .setTitle(`${emoji}`)
          .setDescription(
            `Emoji Has Been Added! | Name : ${emoji.name || `${customemoji.name}`} | Preview : [Click Me](${emoji.url})`)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .addField(
            '**Links**', 
            '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=403008599) | ' +
            '[Support Server](https://discord.gg/pnYVdut) | ' +
            '[Repository](https://github.com/sabattle/CalypsoBot)**'
          )
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor);
        return message.channel.send(Added);
      } else if (urlRegex.test(args[0])) { //check for image urls
        name = args.slice(1).join("_") || Math.random().toString(36).slice(2) //make the name compatible or just choose a random string
        const addedEmoji = await message.guild.emojis.create(
          `${emoji}`,
          `${name || `${customemoji.name}`}`
        );
        return message.channel.send(new MessageEmbed()
          .setTitle(`${addedEmoji}`)
          .setDescription(
            `Emoji Has Been Added! | Name : ${addedEmoji.name || `${customemoji.name}`} | Preview : [Click Me](${addedEmoji.url})`)
          .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
          .addField(
          '**Links**', 
          '**[Invite Me](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=403008599) | ' +
          '[Support Server](https://discord.gg/pnYVdut) | ' +
          '[Repository](https://github.com/sabattle/CalypsoBot)**'
            )
          .setTimestamp()
          .setColor(message.guild.me.displayHexColor));
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