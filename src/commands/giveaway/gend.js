const Command = require('../Command.js');

module.exports = class GendCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'gend',
      aliases: [],
      usage: 'gend <message_id>',
      description: 'End\'s a giveaway',
      type: client.types.GIVEAWAY
    });
  }
  async run (message, args) {
    if (
        !message.member.hasPermission("MANAGE_GUILD") &&
        !message.member.roles.cache.includes(
          (r) => r.name.toLowerCase() === "Giveaway Manager"
        )
      ) {
        return this.sendErrorMessage(message, 0, "you need the `MANAGE_GUILD` permission or the role `Giveaway Manager` to manage giveaways.");
      }
      let id = args[0];
      if (!id)
        return this.sendErrorMessage(message, 0, "Please provide a giveaway/message ID.")
        
      let hasGiveaway = message.client.giveawaysManager.giveaways.find(
        (g) => g.messageID === id
      );
      if (!hasGiveaway)
        return message.reply({
          embed: {
            title: "An Error Occured.",
            description: `The giveaway ID you gave me (${id}), is an invalid giveaway ID.`,
            fields: [
              {
                name: "Common Causes",
                value:
                  "1. The message ID may not actually be a message. \n 2. The message ID isn't a giveaway. \n 3. The message ID is a giveaway, but not hosted by this bot.",
              },
            ],
            color: "#034ea2",
            footer: {
              text: "Join the support server if you have any more errors!",
            },
          },
        });
  
      message.client.giveawaysManager
        .end(hasGiveaway.messageID)
        .then(() => {
          message
            .reply(
              "Giveaway will end in less than " +
                this.client.giveawaysManager.options.updateCountdownEvery /
                  1000 +
                " seconds..."
            )
            .then((m) => m.delete({ timeout: 2000 }));
        })
        .catch((e) => {
          message.reply({
            embed: {
              title: "Oh no! Something went wrong.",
              description: `Oh no! Something went wrong. Please report this to the support server. \n \`\`\`js \n ${e.message}\`\`\``,
              footer: { text: "Weird." },
            },
          });
        });
      if (message.deletable) message.delete();
      return;
    }
  };