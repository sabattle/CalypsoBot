const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const colors = require('../../utils/colors.json');
const { oneLine } = require('common-tags');

module.exports = class CreateDefaultColorsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createdefaultcolors',
      aliases: ['cdc'],
      usage: 'createdefaultcolors',
      description: oneLine`
        Generates the 20 default color roles that come with packaged with Calypso on your server. 
        Color roles are denoted by the prefix \`#\`.
      `,
      type: client.types.COLOR,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES']
    });
  }
  async run(message) {

    const embed = new MessageEmbed()
      .setTitle('Create Default Colors')
      .setDescription('Creating colors...')
      .setColor(message.guild.me.displayHexColor);
    const msg = await message.channel.send(embed);

    // Create default colors
    let position = 1;
    const colorList = [];
    for (let [key, value] of Object.entries(colors)){
      key = '#' + key;
      if (!message.guild.roles.cache.find(r => r.name === key)) {
        try {
          const role = await message.guild.roles.create({
            data: {
              name: key,
              color: value,
              position: position,
              permissions: []
            }
          });
          colorList.push(role);
          position++; // Increment position to create roles in order
        } catch (err) {
          message.client.logger.error(err.message);
        }
      } 
    }
    const fails = 20 - colorList.length;
    embed // Build embed
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`Created \`${20 - fails}\` of  \`20\` default colors.`)
      .addField('Colors Created', (colorList.length > 0) ? colorList.reverse().join(' ') : '`None`')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    msg.edit(embed);
  }
};
