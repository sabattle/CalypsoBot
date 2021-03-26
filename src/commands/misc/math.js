const Command = require('../Command.js');
const fetch = require('node-fetch');
const math = require("math-expression-evaluator")
const Discord = require('discord.js')

module.exports = class MathCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'math',
      aliases: ['calc'],
      usage: 'math 1+1, math 2*5',
      description: 'It shows you the result of a mathematical operation.',
      type: client.types.MISC
    });
  }
  async run(message, args) {
    const mathembed = new Discord.MessageEmbed()
  
  if (!args[0]) {
return this.sendErrorMessage(message, 0, "what do you want me to calculate")
  }

  let resultado;
  try {
    resultado = math.eval(args.join(" "));
  } catch (e) {
return this.sendErrorMessage(message, 0, "Invalid argument")
  }
  await message.channel.send(`<:think_thonk:817017508984389663> **|** ${message.author.username} the answer is : **${resultado}**`);
  }
};