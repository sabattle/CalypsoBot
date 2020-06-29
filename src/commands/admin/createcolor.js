const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

// Color hex regex
const rgx = /^#?[0-9A-F]{6}$/i;

module.exports = class CreateColorCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'createcolor',
      aliases: ['cc'],
      usage: 'createcolor <hex> <color name>',
      description: 'Creates a new role for the given color hex.',
      type: 'admin',
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['createcolor #FF0000 #Red']
    });
  }
  async run(message, args) {
    const hex = args.shift();
    if (args.length === 0 || !rgx.test(hex))
      return this.sendErrorMessage(message, 'Invalid arguments. Please provide a color hex and a color name.');
    let colorName = args.join(' ');
    if (!colorName.startsWith('#')) colorName = '#' + colorName;
    try {
      const role = await message.guild.roles.create({
        data: {
          name: colorName,
          color: hex,
          permissions: []
        }
      });
      const embed = new MessageEmbed()
        .setTitle('Create Color')
        .setDescription(`Successfully created the ${role} color.`)
        .setFooter(`
          Requested by ${message.member.displayName}#${message.author.discriminator}`, message.author.displayAvatarURL()
        )
        .setTimestamp()
        .setColor(hex);
      message.channel.send(embed);
    } catch (err) {
      message.client.logger.error(err.stack);
      this.sendErrorMessage(message, 'Something went wrong. Please try again.', err.message);
    }
  }
};
