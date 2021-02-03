const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const reactions = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹']

module.exports = class PollCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'poll',
      usage: 'poll question | choice1 | choice2 | choice3 ...',
      description: 'Create a poll upto 20 choices!',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'ADD_REACTIONS'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['poll is @Calypso the best bot?']
    });
  }
  async run(message, args) {
         const [question, ...choices] = args.join(' ').split(' | ')

        if (!question) return this.sendErrorMessage(message, 0, 'Provide a Valid Question');
        if (!choices.length) return this.sendErrorMessage(message, 0, 'Provide Valid Options');
        if (choices.length > 20)  return this.sendErrorMessage(message, 0, 'Options can\'t be longer than 20');

        let i;
        const sent = await message.channel.send(new MessageEmbed()
        .setTitle(`${question}`)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor)
        .setDescription(choices.map((choice, i) => `${reactions[i]} ${choice}`).join('\n')))

        for (i = 0; i < choices.length; i++) await sent.react(reactions[i])
     }
    }