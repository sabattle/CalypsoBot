const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const art = [
  'https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_Full_Signature.png',
  'https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso.png',
  'https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_WIP.png',
  'https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_WIP_2.png',
  'https://raw.githubusercontent.com/sabattle/CalypsoBot/develop/data/images/Calypso_WIP_3.png'
];

module.exports = class GalleryCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gallery',
      aliases: ['art'],
      usage: 'gallery',
      description: 'Displays a gallery of Calypso\'s art.',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message) {
    let n = 0;
    const embed = new MessageEmbed()
      .setTitle('Art Gallery')
      .setDescription('All art courtesy of **CommradeFido#5286**.')
      .setImage(art[n])
      .setFooter(
        'Expires after three minutes.\n' + message.member.displayName,  
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    const json = embed.toJSON();
    const previous = () => {
      (n <= 0) ? n = art.length - 1 : n--;
      return new MessageEmbed(json).setImage(art[n]);
    };
    const next = () => {
      (n >= art.length - 1) ? n = 0 : n++;
      return new MessageEmbed(json).setImage(art[n]);
    };

    const reactions = {
      '◀️': previous,
      '▶️': next,
      '⏹️': null,
    };

    const menu = new ReactionMenu(
      message.client,
      message.channel,
      message.member,
      embed,
      null,
      null,
      reactions,
      180000
    );

    menu.reactions['⏹️'] = menu.stop.bind(menu);
    
  }
};