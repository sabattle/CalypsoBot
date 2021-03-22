const Command = require('../Command.js');
const Discord = require("discord.js");
const DIG = require("discord-image-generation");

module.exports = class PpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deletethis',
      aliases: ['delete'],
      usage: 'deletethis <user>',
      description: 'delete this image generation',
      type: client.types.FUN
    });
  }
async run (message, args) {
    // const m = client.findMember(message, args, true);
      
    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    let m = await message.channel.send("**Please Wait...**");   
    let avatar = user.user.displayAvatarURL({
         dynamic: false,
         format: "png",
       });
   
       let img = await new DIG.Delete().getImage(avatar);
   
       let attach = new Discord.MessageAttachment(img, "delete.png");
       m.delete({ timeout: 5000 });
       message.channel.send(attach);
     }
   };