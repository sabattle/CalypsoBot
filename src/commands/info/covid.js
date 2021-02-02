const fetch = require('node-fetch');
const Command = require('../Command.js');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CovidCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'covid',
      usage: 'covid <country name || all>',
      description: 'Shows covid stats for the provided country.',
      type: client.types.INFO,
      examples: ['covid usa']
    });
  }

    async run (message, args){

        const countries = args.join(" ");

        //Credit to Sarastro#7725 for the command :)
        if(!args[0])  return this.sendErrorMessage(message, 0, 'Please Provide a Argument');

        if(args[0] === "all"){
            fetch(`https://covid19.mathdro.id/api`)
            .then(response => response.json())
            .then(data => {
                let confirmed = data.confirmed.value.toLocaleString()
                let recovered = data.recovered.value.toLocaleString()
                let deaths = data.deaths.value.toLocaleString()
                const embed = new Discord.MessageEmbed()
                .setTitle(`Worldwide COVID-19 Stats 🌎`)
                .addField('Confirmed Cases', confirmed)
                .addField('Recovered', recovered)
                .addField('Deaths', deaths)
                .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);

                message.channel.send(embed)
            })
        } else {
            fetch(`https://covid19.mathdro.id/api/countries/${countries}`)
            .then(response => response.json())
            .then(data => {
                let confirmed = data.confirmed.value.toLocaleString()
                let recovered = data.recovered.value.toLocaleString()
                let deaths = data.deaths.value.toLocaleString()
                const embed = new Discord.MessageEmbed()
                .setTitle(`COVID-19 Stats for **${countries}**`)
                .addField('Confirmed Cases', confirmed)
                .addField('Recovered', recovered)
                .addField('Deaths', deaths)
                .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
                .setTimestamp()
                .setColor(message.guild.me.displayHexColor);
                message.channel.send(embed)
            }).catch(err => {
              this.logError(message, err)
                      message.client.logger.error(err.stack);
          this.sendErrorMessage(message, 1, 'Invalid country provided', err.message);
            })
        }
    }
}