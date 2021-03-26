const Command = require('../Command.js');
const db = require('quick.db');

module.exports = class MyVouchCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'disablexp',
      aliases: ['resetxp', 'dxp'],
      description: 'Disable Xp messages',
      ownerOnly: true,
      type: client.types.OWNER
    });
  }
  async run(message) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("**You Do Not Have The Required Permissions! - [ADMINISTRATOR]**")

    try {
        let a  = await db.fetch(`guildMessages_${message.guild.id}`)

        if (!a) {
            return message.channel.send("**XP Messages Are Already Disabled In The Server!**")
        } else {
            db.delete(`guildMessages_${message.guild.id}`)

            message.channel.send("**XP Messages Are Disabled Successfully!**")
        }
        return;
    } catch {
        return message.channel.send("**Something Went Wrong!**")
    }
}}