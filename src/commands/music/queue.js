const Command = require('../Command.js');
const Pagination = require("discord-paginationembed");
const { MessageEmbed } = require('discord.js');

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'queue',
      aliases: ['q'],
      usage: 'queue',
      description: 'displays the queue',
      type: client.types.MUSIC
    });
  }

    
	async run (message, args, data) {

		const voice = message.member.voice.channel;
		if (!voice){
			return this.sendErrorMessage(message, 0, "Join a voicechannel first")
		}
        
		const queue = this.client.player.getQueue(message);

		if(!queue){
			return this.sendErrorMessage(message, 0, "Queue and player were empty");
		}

		if(queue.tracks.length === 1){
			const embed = new MessageEmbed()
				.setColor('RANDOM')
				.addField("Now playing", `[${queue.tracks[0].title}](${queue.tracks[0].url}) | *Requested by* ${queue.tracks[0].requestedBy}`);
			return message.channel.send(embed);
		}
		let i = 0;

		const FieldsEmbed = new Pagination.FieldsEmbed();

		FieldsEmbed.embed
			.setColor('RANDOM')
			.setAuthor('Server Queue', message.guild.iconURL({ dynamic: true }))
			.addField('Now playing', `[${queue.tracks[0].title}](${queue.tracks[0].url}) | *Requested by ${queue.tracks[0].requestedBy}*\n`);
		
		FieldsEmbed.setArray(queue.tracks[1] ? queue.tracks.slice(1, queue.tracks.length) : [])
			.setAuthorizedUsers([message.author.id])
			.setChannel(message.channel)
			.setElementsPerPage(5)
			.setPageIndicator(true)
			.formatField("Queue", (track) => `${++i}. [${track.title}](${track.url}) | *Requested by ${track.requestedBy}*\n`);
 
		FieldsEmbed.build();
        
	}

}