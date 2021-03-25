const Command = require('../Command.js');
const embedcolor = '#00ffff'

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['sk'],
      usage: 'skip',
      description: 'skips a song',
      type: client.types.MUSIC
    });
  }

  async run ( message) {
    const queue = this.client.player.getQueue(message);

    if (!message.member.voice.channel) return this.sendErrorMessage(message,0, "Join a voicechannel first");
  
      if (!queue) return this.sendErrorMessage(message, 0, "Queue is empty, nothing to skip");
      if(!queue.tracks[0]) return this.sendErrorMessage(message, 0, "no next song to skip");
  
      this.client.player.skip(message);
  
      message.react('👌');
      }
  };