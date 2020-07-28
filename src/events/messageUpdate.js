module.exports = (client, oldMessage, newMessage) => {
  if (
    newMessage.member && 
    newMessage.id === newMessage.member.lastMessageID &&
    !oldMessage.command
  ) {
    client.emit('message', newMessage);
  }
};