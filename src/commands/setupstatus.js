module.exports = {
  name: 'setupstatus',
  usage: '',
  description: 'Checks the current status of the server\'s configuration (server administrators only).',
  tag: 'mod',
  run: (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')){
      try {
        const config = message.client.getConfig.get(message.guild.id);
        message.channel.send(`__**Setup Status:**__
        **Default Channel ID:** \`\`${config.defaultChannelID}\`\`
        **Member Role:** \`\`${config.memberRole}\`\`
        **Moderator Role:** \`\`${config.modRole}\`\`
        **Administrator Role:** \`\`${config.adminRole}\`\`
        **Crown Role:** \`\`${config.crownRole}\`\`
        **Auto Role:** \`\`${config.autoRole}\`\``);
      }
      catch (err) {
        return message.channel.send('Unable to fetch server information. Please run ``!setup``.');
      }
    }
    else message.channel.send(`${message.member}, you need the **Administrator** permission to use this command.`);
  }
};
