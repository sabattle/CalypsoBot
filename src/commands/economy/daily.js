const Command = require('../Command.js');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require('parse-ms')

module.exports = class BalanceCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'daily',
        aliases: ['streak'],
        usage: 'daily',
        description: 'daily',
        type: client.types.ECONOMY
      });
    }
    
    async run (message, args) {
let user = message.author;

let timeout = 86400000;
let amount = `${Math.floor(Math.random() * 1000) + 1}`;

let daily = await db.fetch(`daily_${user.id}`);

if (daily !== null && timeout - (Date.now() - daily) > 0) {
    let time = ms(timeout - (Date.now() - daily));

    let timeEmbed = new MessageEmbed()
        .setAuthor("Spam isn't cool fam")
        .setColor("Random")
        .setDescription(`I'm not made of money dude, wait **${time.hours}h, ${time.minutes}m, ${time.seconds}s**`);
    message.channel.send(timeEmbed)
} else {
    let moneyEmbed = new MessageEmbed()
        .setColor("GREEN")
        .setDescription(`✅ You've collected your daily reward of ${amount} coins`);
    message.channel.send(moneyEmbed)
    db.add(`money_${user.id}`, amount)
    db.set(`daily_${user.id}`, Date.now())


}
}
}