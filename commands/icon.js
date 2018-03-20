const Discord = require("discord.js");

module.exports = {
  name: "icon",
  usage: "",
  description: "Displays the server's icon.",
  tag: "general",
  run: (bot, message, args) => {
    let embed = new Discord.RichEmbed()
      .setAuthor("Atlas's Icon")
      .setImage(message.guild.iconURL)
      .setColor(bot.color);
    message.channel.send(embed);
  }
}
