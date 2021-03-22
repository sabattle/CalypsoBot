const Command = require('../Command.js');
const { MessageAttachment } = require('discord.js')
const fetch = require('node-fetch');

module.exports = class TrumpTweetCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'trumptweet',
      aliases: ['trump'],
      usage: 'trumptweet <message>',
      description: 'Display\'s a custom tweet from DonadTrump with the message provided.',
      type: client.types.FUN,
      examples: ['trump This server is best!']
    });
  }
  async run(message, args) {
    
    if (!args[0]) return this.sendErrorMessage(message, 0, 'Please provide a message to tweet');
    let text = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    if (text.length > 68) text = text.slice(0, 65) + '...';

		const url = `https://nekobot.xyz/api/imagegen?type=trumptweet&text=${text}`;

		let response;
		try {
			response = await fetch(url).then(res => res.json());
		}
		catch (e) {
			return message.channel.send('❎ An error occured, please try again!');
		}
		const attachment = new MessageAttachment(response.message, 'clyde.png');
		return message.channel.send(attachment);
  
    }
}