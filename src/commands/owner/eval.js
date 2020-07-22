const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class EvalCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      usage: 'eval <code>',
      description: 'Executes the provided code and shows output.',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['eval 1 + 1']
    });
  }
  run(message, args) {
    const input = args.join(' ');
    if(!input.toLowerCase().includes('token')) {
      try {
        let output = eval(input);
        if (input.length < 1) return this.sendErrorMessage('Invalid argument. Please provide code to eval.');
        if (typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
        
        const embed = new MessageEmbed()
          .addField('Input', `\`\`\`js\n${input.length > 1024 ? 'Too large to display.' : input}\`\`\``)
          .addField('Output', `\`\`\`js\n${output.length > 1024 ? 'Too large to display.' : output}\`\`\``)
          .setColor('#66FF00');
        message.channel.send(embed);

      } catch(err) {
        const embed = new MessageEmbed()
          .addField('Input', `\`\`\`js\n${input.length > 1024 ? 'Too large to display.' : input}\`\`\``)
          .addField('Output', `\`\`\`js\n${err.length > 1024 ? 'Too large to display.' : err}\`\`\``)
          .setColor('#FF0000');
        message.channel.send(embed);
      }
    } else {
      message.channel.send('(╯°□°)╯︵ ┻━┻ MY token. **MINE**.');
    }
  }
};