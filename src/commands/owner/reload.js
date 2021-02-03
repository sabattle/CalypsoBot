const Command = require('../Command.js');

module.exports = class ReloadCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'reload',
      usage: 'reload <category> <command>',
      description: 'Reloads a Command by category',
      type: client.types.OWNER,
      ownerOnly: true,
      examples: ['reload owner eval']
    });
  }
    async run(message, args) {
    if(!args[0]) return this.sendErrorMessage("You must provide a category.")
    if(!args[1]) return this.sendErrorMessage(message, 0, 'You must provide a command name.')

    let commandCategory = args[0].toLowerCase()
    let commandName = args[1].toLowerCase() 
    let oldCommand = message.client.commands.get(commandName); //Check for command

		if (oldCommand.aliases) {
            oldCommand.aliases.forEach(async alias => {
			await message.client.aliases.delete(alias); //delete Aliases to make space for new Command Aliases
		})}

    try {
        delete require.cache[require.resolve(`${process.cwd()}/src/commands/${commandCategory}/${commandName}.js`)] // path depends on your hosting/machine
        await this.client.commands.delete(commandName)
        const CommandStructure = require(`${process.cwd()}/src/commands/${commandCategory}/${commandName}.js`)
        const command = new CommandStructure(message.client);

        if (command.name && !command.disabled) {
          // Map command
          this.client.commands.set(command.name, command);
          // Map command aliases
          if (command.aliases) {
            command.aliases.forEach(async alias => {
              await this.client.aliases.set(alias, command);
            });
          }

        message.channel.send('Done ! Succesfully reloaded ' + commandName)
    }} catch(err) {
        return this.sendErrorMessage(message, 1, `Could not reload: ${commandName}`, err.stack);
    }
  }
}