const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const {success, fail} = require('../../utils/emojis.json')

module.exports = class FilterCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'w-filters',
      aliases: ['filters'],
      usage: 'w-filters',
      description: 'shows the list of active/inactive filters',
      type: client.types.MUSIC
    });
  }

  async run (message, args) {
    const queue = this.client.player.getQueue(message);

    if (!message.member.voice.channel)
return this.sendErrorMessage(message, 0, "Join a voice channel to play music.");

if (!queue)
return this.sendErrorMessage(message, 0, "Queue is Empty.");

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
return this.sendErrorMessage(message, 0, "Error, you must be in my voicechannel");

const filtersStatuses = [[], []];

this.client.filters.forEach((filterName) => {
  const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
    array.push(filterName.charAt(0).toUpperCase() + filterName.slice(1) + " : " + (this.client.player.getQueue(message).filters[filterName] ? success : fail));
});
const embed = new MessageEmbed()
.setAuthor('Now Playing')
.setDescription('List of all filters enabled or disabled.\nUse \`!filter\` to add a filter to a song.')
.setThumbnail(message.guild.iconURL())
.addField('Filters', filtersStatuses[0].join('\n'), true)
.addField('** **', filtersStatuses[1].join('\n'), true)
.setTimestamp()
.setColor('RANDOM')
.setFooter('music system');
message.channel.send(embed)
}}