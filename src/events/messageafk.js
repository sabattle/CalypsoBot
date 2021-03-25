const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const db = require('quick.db')

module.exports = async (client, message) => {
  if (!message.guild) return;
  
  if(db.has(`afk-${message.author.id}+${message.guild.id}`)) {
        const info = db.get(`afk-${message.author.id}+${message.guild.id}`)
        await db.delete(`afk-${message.author.id}+${message.guild.id}`)
        message.reply(`Your afk status have been removed (${info})`)
    }
    //checking for mentions
    if(message.mentions.members.first()) {
        if(db.has(`afk-${message.mentions.members.first().id}+${message.guild.id}`)) {
            message.channel.send(message.mentions.members.first().user.tag + " is currently afk for: " + db.get(`afk-${message.mentions.members.first().id}+${message.guild.id}`))
        }else return;
  }else;
};