const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const translate = require('node-google-translate-skidz');

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'translate',
      aliases: ['trlt'],
      usage: 'translate <Input language> <Output language> <Text to translate>',
      description: 'Translate the text to the language you want',
      type: client.types.FUN
    });
  }
  async run(message, args) {

    if(!args[2]) return message.channel.send(`Invalid form, example of how to use: \`${message.client.db.settings.selectPrefix.pluck().get(message.guild.id)}translate en es Hello World\` \n ${"(en = Language of the text set, es = Language to which you want to translate)"}`)

    try {
      translate({
        text: args.slice(2).join(" "),
        source: args[0],
        target: args[1] 
       }, function(result) {
        message.channel.send(result.translation) 
      });
    } catch (err) {
      message.client.logger.error(err);
      this.sendErrorMessage(message, 1, 'Please try again in a few seconds', err.message);
    }
  }
};