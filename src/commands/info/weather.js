const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const weather = require('weather-js')

module.exports = class WeatherCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'weather',
      usage: 'weather <city name>',
      description: 'Shows weather of a city',
      type: client.types.INFO,
      examples: ['weather [city name]']
    });
  }
 async run(message, args) {
   try {
        
    if(!args[0]) return this.sendErrorMessage(message, 0, 'Please mention city name.');
      
    weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result){
    
    if(err) message.channel.send(err.message);

    if(result.length === 0) return this.sendErrorMessage(message, 1, 'Please Enter a valid location!');

        var current = result[0].current;
        var location = result[0].location;

        const embed = new MessageEmbed()
            .setDescription(`**${current.skytext}**`)
            .setAuthor(`🌥️ Weather for ${current.observationpoint}`)
            .setThumbnail(current.imageUrl)
            .addField('**Timezone**', `UTC ${location.timezone}`, true)
            .addField('**Degree Type**', `${location.degreetype}`, true)
            .addField('**Temperature**', `${current.temperature} Degrees`, true)
            .addField('**Feels Like**', `${current.feelslike} Degrees`, true)
            .addField('**Winds**', `${current.winddisplay}`, true)
            .addField('**Humidity**', `${current.humidity}%`, true)
            .addField('**Date**', `${current.date}`, true)
            .addField('**Day**', `${current.day}`, true)
            .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setColor(message.guild.me.displayHexColor);
        message.channel.send({embed})
    });
   } catch (err) {
    this.sendErrorMessage(message, 1, 'Please Enter a valid location!');
   }
  }
}