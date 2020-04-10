const Command = require('../Command.js');

module.exports = class SetVoicePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setvoicepoints',
      aliases: ['setvp', 'svp'],
      usage: '<POINT COUNT>',
      description: 'Sets amount of points earned per minute in voice chat.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    if (args.length === 0 || !Number.isInteger(Number(args[0])) || args[0] < 0) 
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please enter a positive integer.`);
    message.client.db.guildSettings.updateVoicePoints.run(args[0], message.guild.id);
    message.channel.send(`Successfully updated \`voice points\` to \`${args[0]}\`.`);
  }
};
