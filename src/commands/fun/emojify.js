const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { fail } = require('../../utils/emojis.json');
const specialChars = {
  '0': ':zero:',
  '1': ':one:',
  '2': ':two:',
  '3': ':three:',
  '4': ':four:',
  '5': ':five:',
  '6': ':six:',
  '7': ':seven:',
  '8': ':eight:',
  '9': ':nine:',
  '#': ':hash:',
  '*': ':asterisk:',
  '?': ':grey_question:',
  '!': ':grey_exclamation:',
  ' ': '   ',
};

module.exports = class EmojifyCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'emojify',
      aliases: ['sayemoji'],
      usage: 'emojify <message>',
      description: 'Swaps every letter within the provided message with an emoji.',
      type: client.types.FUN,
      examples: ['emojify hello world']
    });
  }
  run(message, args) {
    const emojified = `${args.join(' ')}`.toLowerCase().split('').map(letter => {
			if (/[a-z]/g.test(letter)) {
				return `:regional_indicator_${letter}: `;
			}
			else if (specialChars[letter]) {
				return `${specialChars[letter]} `;
			}
			return letter;
		}).join('');

		if(emojified.length > 2000) {
      const embed = new MessageEmbed()
      .setDescription(`${fail} The emojified message exceeds over 2000 characters`)
			return message.channel.send(embed)
		}
	message.channel.send(emojified);

    }
}