const Command = require('../Command.js');
const ReactionMenu = require('../ReactionMenu.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
 
module.exports = class RHelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rhelp',
      usage: 'rhelp',
      description: 'Displays a reaction menu of Bot\'s Commands, still under dev',
      type: client.types.INFO,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS']
    });
  }
  run(message, args) {
    const {INFO, FUN, COLOR, MISC, MOD, ADMIN, OWNER, BIO, NSFW, MUSIC } = message.client.types;
    const { capitalize } = message.client.utils;
    const arr = Object.values(message.client.types)
    const pages = []
    arr.forEach(type => pages.push(message.client.utils.capitalize(type)));
    let n = 0;
    const embed = new MessageEmbed()
      .setTitle(pages[n])
      .setDescription(message.client.commands.filter(x => x.type === pages[n].toLowerCase()).map(x => x.name))
      .setFooter(
        'Expires after three minutes.\n' + message.member.displayName,  
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor("RANDOM");
    const json = embed.toJSON();
    const previous = () => {
      (n <= 0) ? n = pages.length - 1 : n--;
      return new MessageEmbed(json).setTitle(pages[n]).setDescription(message.client.commands.filter(x => x.type === pages[n].toLowerCase()).map(x => x.name));
    };
    const next = () => {
      (n >= pages.length - 1) ? n = 0 : n++;
      return new MessageEmbed(json).setTitle(pages[n]).setDescription(message.client.commands.filter(x => x.type === pages[n].toLowerCase()).map(x => x.name));
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