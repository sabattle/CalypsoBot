const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'loop',
      aliases: ['lp'],
      usage: 'loop',
      description: 'loops the player',
      type: client.types.MUSIC
    });
  }

async run (message) {
    if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "join a voicechannel first");

    if (!this.client.player.getQueue(message)) return this.sendErrorMessage(message, 0, "player and queue were empty");

    const repeatMode = this.client.player.getQueue(message).repeatMode;

    if (repeatMode) {
        this.client.player.setRepeatMode(message, false);

        const disabled = new MessageEmbed()
        .setTitle('Loop Disabled!')
        .setDescription(`Repeat mode **disabled** !`)
        .setFooter('Music System')
        .setColor('RANDOM')
        .setTimestamp();

        return message.channel.send(disabled);
    } else {
        this.client.player.setRepeatMode(message, true);

        const enabled = new MessageEmbed()
        .setTitle('Loop Enabled!')
        .setDescription(`Repeat mode **enabled** !`)
        .setFooter('Music System')
        .setColor('RANDOM')
        .setTimestamp();

        return message.channel.send(enabled);
    };
    }
}