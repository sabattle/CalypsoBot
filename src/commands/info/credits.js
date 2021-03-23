const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class CreditsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'credits',
      aliases: [],
      usage: 'credits',
      description: 'shows the people who helped us building this bot.',
      type: client.types.INFO
    });
  }
  run(message) {
    const embed = new MessageEmbed()
    .setAuthor('Credits')
    .setDescription(`Many people contributed building this bot some of them were listed below feel free to add a star to the repository.`)
    .addField('IshitaJs',`[Github](https://github.com/ishitajs) + [Discord](https://discord.gg/drunk)`, false)
    .addField('SaBattle', `[Github](https://github.com/sabattle) + [Discord](https://discord.gg/zB9xKAjrHV) `, true)
    .addField('Anogh', `[Github](https://github.com/Anogh297) + [Discord](https://discord.gg/zB9xKAjrHV)`, true)
    .addField('Hurricano', `[Github](https://github.com/ishitajs/Hurricano) + [Discord](https://discord.gg/tfv7Kw86Rm)`, true)
    .addField('Zerio', `[Github](https://github.com/ZerioDev/Music-bot) + [Discord](https://discord.gg/5cGSYV8ZZj)`, true)
    .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor('#00ffff');
    message.channel.send(embed);
  }
};
