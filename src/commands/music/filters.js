const Command = require('../Command.js');
const {success, fail} = require('../../utils/emojis.json');
const { MessageEmbed } = require('discord.js');

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
if (!message.member.voice.channel) return this.sendErrorMessage(message, 0, "Join a voicechannel first.")

if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) 
return this.sendErrorMessage(message, 0, "we are not in same voicechannel")

if (!this.client.player.getQueue(message)) return this.sendErrorMessage(message, 0, "Queue is empty")

const disabledEmoji = fail;
const enabledEmoji = success;

const filtersStatuses = [[], []];

Object.keys(this.client.filters).forEach((filterName) => {
    const array = filtersStatuses[0].length > filtersStatuses[1].length ? filtersStatuses[1] : filtersStatuses[0];
    array.push(this.client.filters[filterName] + " : " + (this.client.player.getQueue(message).filters[filterName] ? enabledEmoji : disabledEmoji));
});

const embed = new MessageEmbed()
.setColor('RANDOM')
.setDescription(`List of all filters enabled or disabled.\nTo enable a filter type \`filter <filter_name>\``)
.addField("Filters",filtersStatuses[0].join('\n'), true)
.addField("** **",  filtersStatuses[1].join('\n'), true)
.setTimestamp()

message.channel.send(embed)
}}