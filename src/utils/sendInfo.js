const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = function sendInfo(message) {
  const prefix = message.client.db.guildSettings.selectPrefix.pluck().get(message.guild.id); // Get prefix
  const embed = new MessageEmbed()
    .setTitle('Hi, I\'m Calypso. Need help?')
    .setDescription(`You can see everything I can do by using the \`${prefix}help\` command.`)
    .addField('Invite Me', oneLine`
      You can add me to your server by clicking 
      [here](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=268528727)!
    `)
    .addField('Support', oneLine`
      If you have questions, suggestions, or found a bug, please join the 
      [Calypso Support Server](https://discord.gg/pnYVdut)!
    `)
    .setFooter('DM Nettles#8880 to speak directly with the developer!')
    .setThumbnail('https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png')
    .setColor(message.guild.me.displayHexColor);
  message.channel.send(embed);
};

