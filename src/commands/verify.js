module.exports = {
  name: 'verify',
  usage: '<USER MENTION>',
  description: 'Adds your server\'s member role to the mentioned user.',
  tag: 'general',
  run: async (message) => {
    let row;
    try {
      row = message.client.getRow.get(message.guild.id);
      if (row.memberRole === 'none') return message.channel.send('There is currently no member role on this server.');
    }
    catch (err) {
      return message.channel.send('Sorry, I don\'t know the name of this server\'s member role. Has a server administrator ran ``!setup``?');
    }
    if (message.member.roles.find(r => r.name === row.memberRole)){ // role check
      const target = message.mentions.members.first();
      const role = message.guild.roles.find(r => r.name === row.memberRole);
      if (!target) return message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that user.`);
      if (target.roles.has(role.id)) message.channel.send(`${target.displayName} is already a ${row.memberRole}!`);
      else {
        try {
          await target.addRole(role);
          message.channel.send(`${target.displayName} is now a ${row.memberRole}.`);
        }
        catch (err) {
          console.log(err.message);
        }
      }
    }
    else message.channel.send(`${message.member.displayName}, you must be a ${row.memberRole} to use this command.`);
  }
};
