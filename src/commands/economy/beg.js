const Command = require('../Command.js');
const db = require('quick.db')
const { MessageEmbed } = require('discord.js')
const ms = require("parse-ms");

module.exports = class BegCommand extends Command {
    constructor(client) {
      super(client, {
        name: 'beg',
        usage: 'beg',
        description: 'beg for some coins',
        type: client.types.ECONOMY
      });
    }
    async run (message) {
        let user = message.author;

        let timeout = 120000;
        let amount = `${Math.floor(Math.random() * 100) + 1}`;

        let beg = await db.fetch(`beg_${user.id}`);

        if (beg !== null && timeout - (Date.now() - beg) > 0) {
            let time = ms(timeout - (Date.now() - beg));

            let timeEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`❌ You've already begged recently\n\nBeg again in ${time.minutes}m ${time.seconds}s `);
            message.channel.send(timeEmbed)
        } else {
            let moneyEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setDescription(`✅ You've begged and received ${amount} coins`);
            message.channel.send(moneyEmbed)
            db.add(`money_${user.id}`, amount)
            db.add(`begs_${user.id}`, 1)
            db.set(`beg_${user.id}`, Date.now())


        }
    }
};