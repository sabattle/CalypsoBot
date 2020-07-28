module.exports = (client, oldMessage, newMessage) => {
  if (newMessage.member && newMessage.id === newMessage.member.lastMessageID) {
    client.emit('message', newMessage);
  }
};