const Command = require('../Command.js');

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'pause',
      aliases: ['ps'],
      usage: 'pause',
      description: 'pauses the player',
      type: client.types.MUSIC
    });
  }

async run (message, args) {

const queue = this.client.player.getQueue(message);

const voice = message.member.voice.channel;
if (!voice){
    return this.sendErrorMessage(message, 0,"music/play:NO_VOICE_CHANNEL");
}

if(!queue){
    return this.sendErrorMessage(message,0,"music:play:NOT_PLAYING");
}

// Gets the current song
await this.client.player.pause(message);

// Send the embed in the current channel
message.channel.send("paused the player");

}

}
