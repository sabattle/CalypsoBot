const Command = require('../Command.js');
const axios = require('axios');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class CoronaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'corona',
      aliases: ['cv'],
      usage: 'corona [country]',
      description: 'Says those infected with Corona in the world.',
      type: client.types.FUN
    });
  }
  async run(message, args) {
	  let text = args.join(" ");
        const baseUrl = "https://corona.lmao.ninja/v2";

        let url, response, corona;

        try {
            url = text[0] ? `${baseUrl}/countries/${text.replace(new RegExp(",", "g"), "%20")}`:`${baseUrl}/all`
            response = await axios.get(url)
            corona = response.data
        } catch (error) {
            return message.channel.send(`***${text}*** does not exist, or there is no data on the selected country.`)
        }

        const embed = new MessageEmbed()
            .setTitle(args[0] ? `Stats ${text.toUpperCase()}` : 'Total Corona cases in the world')
            .setColor(message.guild.me.displayHexColor)
            .setThumbnail(args[0] ? corona.countryInfo.flag : 'https://i.giphy.com/YPbrUhP9Ryhgi2psz3.gif')
            .addFields(
                {
                    name: 'Total Cases:',
                    value: corona.cases.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Total Deaths:',
                    value: corona.deaths.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Total Recovered:',
                    value: corona.recovered.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Active Cases:',
                    value: corona.active.toLocaleString(),
                    inline: true
                },
                {
                    name: '\u200b',
                    value: '\u200b',
                    inline: true
                },
                {
                    name: 'Critical Cases:',
                    value: corona.critical.toLocaleString(),
                    inline: true
                },
                {
                    name: 'Recovered Today:',
                    value: corona.todayRecovered.toLocaleString().replace("-", ""),
                    inline: true
                },
                {
                    name: 'New Cases Today:',
                    value: corona.todayCases.toLocaleString().replace("-", ""),
                    inline: true
                },
                {
                    name: 'Dead today:',
                    value: corona.todayDeaths.toLocaleString(),
                    inline: true
                })

        await message.channel.send(embed)
    }
  }