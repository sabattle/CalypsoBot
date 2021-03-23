const Command = require('../Command.js');
const math = require("mathjs");
const Discord = require("discord.js");

module.exports = class MathCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      aliases: ['calc','calculate'],
      usage: 'math 2+2',
      description: 'ask the bot to calculate simple maths',
      type: client.types.MISC
    });
  }
  async run (message, args) {

    if(!args[0]) {
        return this.sendErrorMessage(message, 0, "Iam sorry but I need something to calculate");
    }

    let result;
    try {
        result = math.evaluate(args.join(" ").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/"));
    } catch (e) {
        return this.sendErrorMessage(message, 0,'comeon man, dont be dumb Input something valid to calculate');
    }

    const embed = new Discord.MessageEmbed()
        .setColor("RANDOM")
        .addField(('Input'), `\`\`\`js\n${args.join("").replace(/[x]/gi, "*").replace(/[,]/g, ".").replace(/[÷]/gi, "/")}\`\`\``)
        .addField(('Result'), `\`\`\`js\n${result}\`\`\``)
    message.channel.send(embed);

}
}