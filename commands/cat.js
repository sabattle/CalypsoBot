const Discord = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
  name: "cat",
  usage: "",
  description: "Calypso will find a random cat for your viewing pleasure.",
  tag: "fun",
  run: async (bot, message, args) => {
    let img = (await snekfetch.get("http://aws.random.cat/meow")).body.file;
    if (!img) return message.channel.send("Yikes, I think the kitties are on the fritz! Try again in a few seconds.")
    let embed = new Discord.RichEmbed()
      .setAuthor("Meow!")
      .setImage(img)
      .setColor(bot.color);
    message.channel.send(embed);
  }
}
