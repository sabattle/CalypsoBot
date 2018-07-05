module.exports = {
  name: 'verify',
  usage: '<USER MENTION>',
  description: 'Adds the member role to the mentioned user.',
  tag: 'admin',
  run: async (message, args) => {
    if (message.member.roles.find('name', 'Admin')){ //role check
      let target = message.mentions.members.first();
      let role = message.guild.roles.find('name', 'Member');
      console.log(role.name)
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
    else message.channel.send(`${target.displayName}, you must be an admin to use this command.`);
  }
}
