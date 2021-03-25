const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class NukechannelCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nukechannel',
      aliases: ['nuke'],
      usage: 'nukechannel',
      description: 'nukes a channel',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD']
    });
  }
 async run(message) {
    if (!message.member.hasPermission("MANAGE_CHANNELS")) {
        return message.channel.send("You Don't Have Permission!")
    }

    message.channel.send('**nuking...**')
    
    await message.channel.clone().then

    ((ch) =>{ch.setParent(message.channel.parent.id);

    ch.setPosition(message.channel.position);

    message.channel.delete().then

    (ch.send('**Channel Has Been Nuked** \n https://imgur.com/LIyGeCR'))

});
}
}