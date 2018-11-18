const Discord = require('discord.js');

module.exports = {
  name: 'setup',
  usage: '',
  description: 'Sets up Calypso for your server (server administrators only).',
  tag: 'mod',
  run: (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')){
      const guildID = message.guild.id;
      let defaultChannelID = '', memberRole = '', modRole = '', adminRole = '', crownRole = '', autoRole = '';
      let prompt = 0;
      message.channel.send(`Hello ${message.member}, welcome to my setup process! This won't take long. Please respond with only one message and wait until prompted (bot commands are ignored). Also please note that **I must be at the top of the role hierarchy for my features to work correctly**.`);
      message.channel.send('First, please enter the ID of your **Default** channel. You can get the ID by running the ``!findid`` command or by right clicking the channel and choosing "Copy ID" (developer mode must be enabled). Welcome messages, stream alerts, and announcements will be sent here. If you do not have one, please type **none**.');
      const collector = new Discord.MessageCollector(message.channel, m => {
        const args = m.content.trim().split(/ +/g);
        const command = message.client.commands.get(args.shift().slice(m.client.prefix.length).toLowerCase());
        if (m.author == message.author && !command) return true;
      }, { maxMatches: 6 });
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
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Administrator** role. If you do not have one, please type **none**.`);
            modRole = msg.content;
            prompt++;
            break;
          case 3:
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Crown** role. This role will be awarded to whoever has the most points per week (for more details, use \`\`!explainpoints\`\` after setup is finished). If you do not have one, please type **none**.`);
            adminRole = msg.content;
            prompt++;
            break;
          case 4:
            message.channel.send(`You entered **${msg.content}**. Lastly, please enter the name of your **Auto** role. This role will automatically be given to someone who joins your server. If you do not have one, please type **none**.`);
            crownRole = msg.content;
            prompt++;
            break;
          case 5:
            message.channel.send(`You entered **${msg.content}**. If anything was entered incorrectly, please run \`\`!setup\`\` again. You can check your current configuration by running \`\`!setupstatus\`\`. You're all finished!`);
            autoRole = msg.content;
            collector.stop();
            break;
        }
      });
      collector.on('end', () => {
        const config = { // config object
          guildID: guildID,
          defaultChannelID: defaultChannelID,
          memberRole: memberRole,
          modRole: modRole,
          adminRole: adminRole,
          crownRole: crownRole,
          autoRole: autoRole
        };
        message.client.setConfig.run(config);
        console.log(`${message.member.displayName} used setup in ${message.guild.name}`);
      });
    }
    else message.channel.send(`${message.member}, you need the **Administrator** permission to use this command.`);
  }
};
