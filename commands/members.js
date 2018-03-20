const Discord = require("discord.js");

module.exports = {
  name: "members",
  usage: "",
  description: "Displays a list of all current members.",
  tag: "general",
  run: (bot, message, args) => {
    let members = message.guild.members.filter(m => {
      if (m.roles.find("name", "Member")) return true;
    });
    let memberList = "";
    members.forEach(m => memberList = memberList + `${m.displayName}\n`);
    let embed = new Discord.RichEmbed()
      .setAuthor("Member List", message.guild.iconURL)
      .setDescription(memberList)
      .setFooter(`${members.size} out of ${message.guild.members.size} accounts`)
      .setColor(bot.color);
    message.channel.send(embed);
  }
}
