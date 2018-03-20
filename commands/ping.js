module.exports = {
  name: "ping",
  usage: "",
  description: "Gets Calypso's current ping.",
  tag: "general",
  run: (bot, message, args) => {
    message.channel.send(`Hey! This is my ping: ${bot.ping}ms.`);
  }
}
