const sqlite = require("sqlite");

module.exports = {
  name: "points",
  usage: "<USER MENTION>",
  description: "Fetches the specified user's amount of points.",
  tag: "admin",
  run: async (bot, message, args) => {
    if (message.member.roles.find("name", "Admin")) {
      let target =  message.mentions.members.first() || message.member;
      let points = await sqlite.get(`SELECT points FROM db WHERE userId ="${target}"`);
      message.channel.send(`${target} has **${points}** points!`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to use this command!`);
  }
}
