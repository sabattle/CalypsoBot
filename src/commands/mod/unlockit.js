const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class LockitCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unlockit',
      usage: 'unlockit',
      description: 'Unlocks a channe;',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['unlockit #general']
    });
  }
  async run(message) {
    if(!message.member.hasPermission("MANAGE_CHANNELS"))
    return this.sendErrorMessage(message, 0, "you donot have permission to use this command.")

    if(!message.mentions.channels.first()) return this.sendErrorMessage(message, 0, "Specify a channel to unlock lol")

   await message.mentions.channels.forEach(async channel => {

        if(channel.permissionsFor(message.guild.id).has("SEND_MESSAGES") === true) return this.sendErrorMessage(message, 0, "That channel is already unlocked.");
        try {
           await channel.updateOverwrite(message.guild.id, {
            SEND_MESSAGES: true
        });
        message.channel.send(`🔓 <#${channel.id}> has been successfully unlocked.`)
        } catch(err) {
            console.log(err);
        }
      }
    )
  }
};