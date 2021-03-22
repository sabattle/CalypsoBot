const Command = require('../Command.js');
const {success, fail} = require('../../utils/emojis.json')

module.exports = class FilterCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'filters',
      aliases: [''],
      usage: 'filters',
      description: 'shows list of avaliable filter\'s',
      type: client.types.MUSIC
    });
  }

  async run (message, args) {
if (!message.member.voice.channel) return message.channel.send ({
    embed: {
        color: '#FA1D2F',
        description: 'you must be in a voice channel to use this command.'
    }
})

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send ({
    embed: {
        color: '#FA1D2F',
        description: 'Oh-oh! we are not in the same voice channel.'
    }
})

if (!this.client.player.getQueue(message)) return message.channel.send ({
    embed: {
        color: '#FD1A2F',
        description: '**Error**! Player is Empty!'
    }
})

const disabledEmoji = fail;
const enabledEmoji = success;

const filtersStatuses = [[], []];

Object.keys(this.client.filters).forEach((filterName) => {
    const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
    array.push(this.client.filters[filterName] + " : " + (this.client.player.getQueue(message).filters[filterName] ? enabledEmoji : disabledEmoji));
});

message.channel.send({
    embed: {
        color: 'ORANGE',
        footer: { text: 'To enable a filter type filter name' },
        fields: [
            { name: 'Filters', value: filtersStatuses[0].join('\n'), inline: true },
            { name: '** **', value: filtersStatuses[1].join('\n'), inline: true },
        ],
        timestamp: new Date(),
        description: `List of all filters enabled or disabled.\n To enable a filter type filter <filter name>`,
    },
});
}
};