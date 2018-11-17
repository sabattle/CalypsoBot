const Discord = require('discord.js');

module.exports = {
  name: 'setup',
  usage: '',
  description: 'Sets up Calypso for your server (server administrators only).',
  tag: 'mod',
  run: (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')){
      const guildID = message.guild.id;
      let defaultChannelID = '', memberRole = '', modRole = '', adminRole = '', crownRole = '';
      let prompt = 0;
      message.channel.send(`Hello ${message.member.displayName}, welcome to my setup process! This won't take long. Please respond with only one message and wait until prompted.`);
      message.channel.send('First, please enter the ID of your **Default** channel. You can get the ID by running the ``!findid`` command or by right clicking the channel and choosing "Copy ID" (developer mode must be enabled). Welcome messages, stream alerts, and announcements will be sent here. If you do not have one, please type **none**.');
      const collector = new Discord.MessageCollector(message.channel, m => {
        if (m.author == message.author) return true;
      }, { maxMatches: 5 });
      collector.on('collect', msg => {
        switch(prompt){
          case 0:
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Member** role. If you do not have one, please type **none**.`);
            defaultChannelID = msg.content;
            prompt++;
            break;
          case 1:
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Moderator** role. If you do not have one, please type **none**.`);
            memberRole = msg.content;
            prompt++;
            break;
          case 2:
            message.channel.send(`You entered **${msg.content}**. Lastly, please enter the name of your **Administrator** role. If you do not have one, please type **none**.`);
            modRole = msg.content;
            prompt++;
            break;
          case 3:
            message.channel.send(`You entered **${msg.content}**. Lastly, please enter the name of your **Crown** role. This role will be awarded to whoever has the most points per week (for more details, use \`\`!explainpoints\`\` after setup is finished). If you do not have one, please type **none**.`);
            adminRole = msg.content;
            prompt++;
            break;
          case 4:
            message.channel.send(`You entered **${msg.content}**. If anything was entered incorrectly, please run \`\`!setup\`\` again. You're all finished!`);
            crownRole = msg.content;
            collector.stop();
            break;
        }
      });
      collector.on('end', () => {
        const row = { // row object
          guildID: guildID,
          defaultChannelID: defaultChannelID,
          memberRole: memberRole,
          modRole: modRole,
          adminRole: adminRole,
          crownRole: crownRole
        };
        message.client.setRow.run(row);
      });
    }
    else message.channel.send(`${message.member.displayName}, you need administrator permissions to run this command.`);
  }
};
