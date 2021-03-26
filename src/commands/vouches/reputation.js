const Command = require('../Command.js');
const ms = require("parse-ms");
const db = require('quick.db');
const Discord = require('discord.js');


module.exports = class VouchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reputation',
      aliases: ['rep'],
      usage: 'rep @user',
      description: 'Give a reputation to a user',
      type: client.types.VOUCH
    });
  }
  async run(message) {

    let timeout =  1800000;

let bump = await db.fetch(`cooldown_${message.author.id}`)
if (bump !== null && timeout - (Date.now() - bump) > 0) {
    let time = ms(timeout - (Date.now() - bump));
return message.channel.send(new Discord.MessageEmbed()
.setAuthor("Spam isn't cool fam" , message.author.displayAvatarURL({dynamic :true}))
.setDescription(`You have already vouched,wait **${time.hours}H , ${time.minutes}M , ${time.seconds}S**`)
.setFooter(message.guild.name , message.guild.iconURL()))}

let user = message.mentions.users.first()
if(!user) return this.sendErrorMessage(message, 0, "mention a user to vouch")
if(user.id === message.author.id) return this.sendErrorMessage(message, 0, "you cant vouch yourself")

db.add(`userthanks_${user.id}`, 1)
db.set(`cooldown_${message.author.id}`, Date.now())
return message.react('👌')
}
};