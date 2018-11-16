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
        **Default Channel ID:** \`\`${row.defaultChannel}\`\`
        **Member Role:** \`\`${row.memberRole}\`\`
        **Moderator Role:** \`\`${row.modRole}\`\`
        **Crown Role:** \`\`${row.crownRole}\`\``);
      }
      catch (err) {
        return message.channel.send('Unable to fetch server information. Please run ``!setup``.');
      }
    }
  }
};
