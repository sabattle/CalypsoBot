const Command = require('../Command.js');

module.exports = class FilterCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'filter',
      aliases: ['fil'],
      usage: 'filter 8D',
      description: 'apply a filter to the player',
      type: client.types.MUSIC
    });
  }

  async run (message, args) {

if (!message.member.voice.channel)
return this.sendErrorMessage(message, 0, "Join a voice channel to play music.");

if (!this.client.player.getQueue(message))
return this.sendErrorMessage(message, 0, "Queue is Empty.");

const filterToUpdate = this.client.filters.find(
(x) => x.toLowerCase() === args[0].toLowerCase()
);

if (!filterToUpdate)
return this.sendErrorMessage(message, 0,
  "This filter doesn't exist. Filters you can use are: \n 8D \n gate \n haas \n phaser \n treble \n tremolo \n vibrato \n reverse \n karaoke \n flanger \n mcompand \n pulsator \n subboost \n bassboost \n vaporwave \n nightcore \n normalizer \n surrounding"
);

const filtersUpdated = {};

filtersUpdated[filterToUpdate] = this.client.player.getQueue(message).filters[
filterToUpdate
]
? false
: true;

this.client.player.setFilters(message, filtersUpdated);
if (filtersUpdated[filterToUpdate])
message.channel.send({
  embed: {
    color: 'RANDOM',
    description: "I am adding the filter to the song, Please wait. The longer the song is, the longer it takes." 
  }
});

else
message.channel.send({
  embed: {
    color: 'RANDOM',
    description: "I am removing the filter(s), Please wait. The longer the song is, the longer this will take."
  }
  });

}};