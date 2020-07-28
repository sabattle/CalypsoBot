module.exports = (client, oldMessage, newMessage) => {
  if (oldMessage.id === oldMessage.member.lastMessageID) {
    client.emit('message', newMessage);
  }
};