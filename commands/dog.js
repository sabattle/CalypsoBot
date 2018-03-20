const Discord = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
  name: "dog",
  usage: "",
  description: "Calypso will find a random pup for your viewing pleasure.",
  tag: "fun",
  run: async (bot, message, args) => {
    let img = (await snekfetch.get("https://random.dog/woof.json")).body.url;
    if (!img) return message.channel.send("Yikes, I think the puppies are on the fritz! Try again in a few seconds.")
    let embed = new Discord.RichEmbed()
      .setAuthor("Woof!")
      .setImage(img)
      .setColor(bot.color);
    message.channel.send(embed);
  }
}
