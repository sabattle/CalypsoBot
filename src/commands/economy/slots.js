const Command = require('../Command.js');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const slotItems = ["🍇", "🍉", "🍌", "🍎", "🍒"];

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'slots',
        usage: 'slots 300',
        description: 'Take your chances at a slot machine. Warning, I am very good at stealing your money.',
        type: client.types.ECONOMY
      });
    }
    async run (message, args) {
        let user = message.author;
        let moneydb = await db.fetch(`money_${user.id}`)
        let money = parseInt(args[0]);
        let win = false;

    
        if (!money) return message.reply("You need to bet something.");
        if (money > moneydb) return message.reply(`You only have ${money}, dont try and lie to me `);
    
        let number = []
        for (let i = 0; i < 3; i++) { number[i] = Math.floor(Math.random() * slotItems.length); }
    
        if (number[0] == number[1] && number[1] == number[2])  { 
            money *= 9
            win = true;
        } else if (number[0] == number[1] || number[0] == number[2] || number[1] == number[2]) { 
            money *= 3
            win = true;
        }
        if (win) {
            let slotsEmbed1 = new MessageEmbed()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou won ${money} coins`)
                .setColor("GREEN")
            message.channel.send(slotsEmbed1)
            db.add(`money_${user.id}`, money)
        } else {
            let slotsEmbed = new MessageEmbed()
                .setDescription(`${slotItems[number[0]]} | ${slotItems[number[1]]} | ${slotItems[number[2]]}\n\nYou lost ${money} coins`)
                .setColor("GREEN")
            message.channel.send(slotsEmbed)
            db.subtract(`money_${user.id}`, money)
        }
    
    }
    }