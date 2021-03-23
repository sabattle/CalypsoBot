const Command = require('../Command.js');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'resume',
      aliases: ['rs'],
      usage: 'resume',
      description: 'resumes the player',
      type: client.types.MUSIC
    });
  }

async run (message, args) {
const queue = this.client.player.getQueue(message);

const voice = message.member.voice.channel;
if (!voice){
    return this.sendErrorMessage(message, 0,"join a voice channel first.");
}

if(!queue){
    return this.sendErrorMessage(message,0,"Queue and player were empty.");
}

// Gets the current song
await this.client.player.resume(message);

// Send the embed in the current channel
message.channel.send('⏯️ **Resuming**');
}

}