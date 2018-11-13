module.exports = {
  name: 'explainpoints',
  usage: '',
  description: 'Explains various aspects of the points system.',
  tag: 'general',
  run: (message) => {
    message.channel.send('Points are earned in the following ways:\nSending messages - **1 point**\nSending links - **10 points**\nSending files - **20 points**\nVoice chat (AFK channel is ignored) - **1 point per minute**\nOn every **Friday** at **7:00 PM EST** points will be reset. Whoever had the most points that week will earn your server\'s **Crown** role. To discover what role that is, you can use the ``!crown`` command. To check the points of yourself or someone else, use ``!points``. If you\'re feeling generous, you can give some of your points away with ``!givepoints``. To check the current top 10 use the ``!top10`` command, or if you want the position of someone specific you can use the ``!position`` command.');
  }
};
