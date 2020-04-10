const Command = require('../Command.js');

module.exports = class SetCommandPointsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setcommandpoints',
      aliases: ['setcp', 'scp'],
      usage: '<POINT COUNT>',
      description: 'Sets amount of points earned per command used.',
      type: 'admin',
      userPermissions: ['MANAGE_GUILD']
    });
  }
  run(message, args) {
    if (args.length === 0 || !Number.isInteger(Number(args[0])) || args[0] < 0) 
      return message.channel.send(`Sorry ${message.member}, I don't recognize that. Please enter a positive integer.`);
    message.client.db.guildSettings.updateCommandPoints.run(args[0], message.guild.id);
    message.channel.send(`Successfully updated \`command points\` to \`${args[0]}\`.`);
  }
};
