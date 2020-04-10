const Command = require('../Command.js');

module.exports = class SetMessagePointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setmessagepoints',
      aliases: ['setmp', 'smp'],
      usage: '<POINT COUNT>',
      description: 'Sets amount of points earned per user message.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    const amount = args[0];
    if (!amount || !Number.isInteger(Number(amount)) || amount < 0) 
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please enter a positive integer.`);
    message.client.db.guildSettings.updateMessagePoints.run(amount, message.guild.id);
    message.channel.send(`Successfully updated \`message points\` to \`${amount}\`.`);
  }
};
