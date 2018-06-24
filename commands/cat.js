const Discord = require("discord.js");
const snekfetch = require("snekfetch");

module.exports = {
  name: "cat",
  usage: "",
  description: "Calypso will find a random cat for your viewing pleasure.",
  tag: "fun",
  run: async (bot, message, args) => {
    let img = null;
    const maxTries = 10;
    let counter = 0;

    // try to get cat image 10 times
    while(!img && counter < maxTries){
        try {
          img = (await snekfetch.get("http://aws.random.cat/meow")).body.file;
        } catch (err) {
          console.log("!cat failed, error: "+err.message);
          img = null;
          counter++;
        }
    }

    // GET failed, try again later
    if (!img) return message.channel.send("Yikes, I think the kitties are on the fritz! Try again in a few seconds.")
    
    // GET was successful, send image to discord
    let embed = new Discord.RichEmbed()
      .setAuthor("Meow!")
      .setImage(img)
      .setColor(bot.color);
    message.channel.send(embed);
  }
}