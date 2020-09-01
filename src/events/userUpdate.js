module.exports = (client, oldUser, newUser) => {

  // Update user in db
  if (oldUser.username != newUser.username || oldUser.discriminator != newUser.discriminator) {
    client.db.users.updateUser.run(newUser.username, newUser.discriminator, newUser.id);
    client.logger.info(`${oldUser.tag} user tag changed to ${newUser.tag}`);
  }

};