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

  async run (client, message, args) {

if (!message.member.voice.channel)
return message.sendError(
  "Not in A Voice Channel.",
  "Please join a voice channel to play music."
);

if (!client.player.getQueue(message))
return message.sendError(
  "No Music is Playing.",
  "Please join a voice channel to play music."
);

const filterToUpdate = client.filters.find(
(x) => x.toLowerCase() === args[0].toLowerCase()
);

if (!filterToUpdate)
return message.sendError(
  "Invalid Filter",
  "This filter doesn't exist. Filters you can use are: \n 8D \n gate \n haas \n phaser \n treble \n tremolo \n vibrato \n reverse \n karaoke \n flanger \n mcompand \n pulsator \n subboost \n bassboost \n vaporwave \n nightcore \n normalizer \n surrounding"
);

const filtersUpdated = {};

filtersUpdated[filterToUpdate] = client.player.getQueue(message).filters[
filterToUpdate
]
? false
: true;

client.player.setFilters(message, filtersUpdated);
if (filtersUpdated[filterToUpdate])
message.sendSuccess(
  "Filter Being Added.",
  "I am adding the filter the the song. Please wait. The longer the song is, the longer it takes."
);
else
message.sendSuccess(
  "Filter Being Removed.",
  "I am removing the filters. Please wait. The longer the song is, the longer this will take.");
}};