const sqlite = require("sqlite");

module.exports = {
  name: "points",
  usage: "<USER MENTION>",
  description: "Fetches a user's current points (or your own points, if no user is mentioned).",
  tag: "admin",
  run: async (bot, message, args) => {
    if (message.member.roles.find("name", "Admin")) {
      let target =  message.mentions.members.first() || message.member;
      let row = await sqlite.get(`SELECT * FROM db WHERE userId ="${target.id}"`);
      message.channel.send(`${target.displayName} has **${row.points}** points!`);
    }
    else message.channel.send(`${message.member.displayName}, you do not have permission to use this command!`);
  }
}
