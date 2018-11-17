module.exports = {
  name: 'setupstatus',
  usage: '',
  description: 'Checks the current status of the server\'s configuration (server administrators only).',
  tag: 'mod',
  run: (message) => {
    if (message.member.hasPermission('ADMINISTRATOR')){
      try {
        const row = message.client.getRow.get(message.guild.id);
        message.channel.send(`__**Setup Status:**__
        **Default Channel ID:** \`\`${row.defaultChannelID}\`\`
        **Member Role:** \`\`${row.memberRole}\`\`
        **Moderator Role:** \`\`${row.modRole}\`\`
        **Administrator Role:** \`\`${row.adminRole}\`\`
        **Crown Role:** \`\`${row.crownRole}\`\`
        **Auto Role:** \`\`${row.autoRole}\`\``);
      }
      catch (err) {
        return message.channel.send('Unable to fetch server information. Please run ``!setup``.');
      }
    }
    else message.channel.send(`${message.member.displayName}, you need the **Administrator** permission to use this command.`);
  }
};
