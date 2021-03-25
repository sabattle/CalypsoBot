const { MessageReaction, User } = require("discord.js");
let db = require("quick.db");
let Discord = require("discord.js");
let { MessageEmbed } = require("discord.js");

module.exports = async (client, reaction1, user) => {
let message = reaction1.message;
  let member = message.guild.members.cache.get(user.id);
  let roleObject = db.fetch(`rolereactions_${message.guild.id}_${message.id}`);
  let starObject = db.fetch(`starboard_${message.guild.id}`);
  let emoji = reaction1.emoji.toString();
  if (roleObject) {
    if (emoji === roleObject.emoji) {
      let role = message.guild.roles.cache.get(roleObject.role);
      if (!member.roles.cache.has(role)) {
        try {
          member.roles.add(role);
        const added = new MessageEmbed()
        .setTitle(`✅ Added A Role In \`${reaction1.message.guild.name}\``)
        .addField(`**Role**`, `${role.name}`)
        .setColor('GREEN')
        .setAuthor(`${reaction1.message.guild.name}`, reaction1.message.guild.iconURL({dynamic: true}))
          member.send(added);
        } catch (e) {
          message.channel.send("Something has gone wrong " + e.message);
        }
      }
    }
  }
};