module.exports = {
  name: 'verify',
  usage: '<USER MENTION>',
  description: 'Adds the member role to the mentioned user.',
  tag: 'general',
  run: async (message) => {
    let row;
    try {
      row = message.client.fetchRow.get(message.guild.id);
      if (row.member === 'none') return message.channel.send('There is currently no member role on this server.');
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of this server\'s member role. Has a server administrator ran ``!setup``?');
    }
    if (message.member.roles.find('name', row.member)){ //role check
      const target = message.mentions.members.first();
      const role = message.guild.roles.find('name', row.member);
      if (target.roles.has(role.id)) message.channel.send(`${target.displayName} is already a member!`);
      else {
        try {
          await target.addRole(role);
          message.channel.send(`${target.displayName} is now a member.`);
        }
        catch (err) {
          console.log(err.message);
        }
      }
    }
    else message.channel.send(`${message.member.displayName}, you must be a member to use this command.`);
  }
};
