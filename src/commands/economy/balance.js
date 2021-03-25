const Command = require('../Command.js');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'balance',
        aliases: ['bal'],
        usage: 'balance @user',
        description: 'check your balance',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]) ||
        message.guild.members.cache.find(
          r =>
            r.user.username.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.guild.members.cache.find(
          r => r.displayName.toLowerCase() === args.join(" ").toLocaleLowerCase()
        ) ||
        message.member;
  
      let bal = db.fetch(`money_${user.id}`);
  
      if (bal === null) bal = 0;
  
      let bank = await db.fetch(`bank_${user.id}`);
  
      if (bank === null) bank = 0;
  
      if (user) {
        let moneyEmbed = new MessageEmbed()
          .setColor("GREEN")
          .setDescription(
            `**${user.user.username}'s Balance**\n\nPocket: ${bal}\nBank: ${bank}`
          );
        message.channel.send(moneyEmbed);
      } else {
        return message.channel.send("**Enter A Valid User!**");
      }
    }
  };