const Discord = require('discord.js');

module.exports = {
  name: 'setup',
  usage: '',
  description: 'Sets up Calypso for your server.',
  tag: 'admin',
  run: (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')){
      const guild = message.guild.id;
      let welcome = '', member = '', mod = '', crown = '';
      let prompt = 0;
      message.channel.send(`Hello ${message.member.displayName}, welcome to my setup process! This won't take long. Please respond with only one message and wait until prompted.`);
      message.channel.send('First, please enter the ID of your **Welcome** channel. You can get the ID by running the ``!findid`` command or by right clicking the channel and choosing "Copy ID" (developer mode must be enabled). Welcome messages and stream alerts will be sent here. If you do not have one, please type **none**.');
      const collector = new Discord.MessageCollector(message.channel, m => {
        if (m.author == message.author) return true;
      }, { maxMatches: 4 });
      collector.on('collect', msg => {
        switch(prompt){
          case 0:
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Member** role. If you do not have one, please type **none**.`);
            welcome = msg.content;
            prompt++;
            break;
          case 1:
            message.channel.send(`You entered **${msg.content}**. Next, please enter the name of your **Moderator** role. If you do not have one, please type **none**.`);
            member = msg.content;
            prompt++;
            break;
          case 2:
            message.channel.send(`You entered **${msg.content}**. Lastly, please enter the name of your **Crown** role. If you do not have one, please type **none**.`);
            mod = msg.content;
            prompt++;
            break;
          case 3:
            message.channel.send(`You entered **${msg.content}**. If anything was entered incorrectly, please run \`\`!setup\`\` again. You're all finished!`);
            crown = msg.content;
            collector.stop();
            break;
        }
      });
      collector.on('end', () => {
        let row = { // row object
          guild: guild,
          welcome: welcome,
          member: member,
          mod: mod,
          crown: crown
        };
        message.client.setRow.run(row);
      });
    }
    else message.channel.send(`${message.member.displayName}, you need administrator privileges to run this command.`);
  }
};
