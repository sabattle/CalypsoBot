const Discord = require("discord.js");
const package = require("../package.json");
const moment = require("moment");

module.exports = {
  name: "bot",
  usage: "",
  description: "Fetches Calypso's information and statistics.",
  tag: "general",
  run: (bot, message, args) => {
    let embed = new Discord.RichEmbed()
      .setAuthor("Calypso's Information", bot.user.avatarURL)
      .setDescription("Calypso is a multi-purpose Discord bot coded by Nettles and designed by Nettles and Mitchelson. She first went live on February 22nd, 2018. In greek mythology, Calypso is said to be the daughter of Atlas.")
      .addField("Current Version", package.version, true)
      .addField("Detected Users", bot.users.size, true)
      .addField("Uptime", `${moment.duration(bot.uptime).hours()} hours`, true)
      .addField("Library/Environment", "Discord.js 11.3.0 | Node.js 8.9.4", true)
      .setFooter("Have Suggestions? DM Nettles or Mitchelson!")
      .setTimestamp()
      .setColor(bot.color);
    message.channel.send(embed);
  }
}
