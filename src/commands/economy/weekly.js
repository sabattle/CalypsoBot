const Command = require('../Command.js');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("parse-ms");

module.exports = class WeeklyCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'weekly',
        usage: 'weekly',
        description: 'claim your weekly rewards',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;
        let timeout = 604800000;
        let amount = 5000;

        let weekly = await db.fetch(`weekly_${user.id}`);

        if (weekly !== null && timeout - (Date.now() - weekly) > 0) {
            let time = ms(timeout - (Date.now() - weekly));

            let timeEmbed = new MessageEmbed()
                .setAuthor('Slow it down bud')
                .setColor("RANDOM")
                .setDescription(`woah! I'm not made of money dude, wait **${time.days}d, ${time.hours}h, ${time.minutes}m**\nThe default cooldown is \`7d.\` `);
            message.channel.send(timeEmbed)
        } else {
            let embed = new MessageEmbed()
            .setAuthor(`Here are your weekly coins, ${message.member.displayName}`)
                .setColor("RANDOM")
                .setDescription(`${amount} coins have been placed in your wallet`); 
            message.channel.send(embed)
            db.add(`money_${user.id}`, amount)
            db.set(`weekly_${user.id}`, Date.now())


        }
    }
}