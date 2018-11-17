module.exports = {
  name: 'explainpoints',
  usage: '',
  description: 'Explains various aspects of the points system.',
  tag: 'fun',
  run: (message) => {
    message.channel.send('Points are earned in the following ways:\nSending messages - **1 point**\nSending links or files - **10 points**\nVoice chat (AFK channel is ignored) - **1 point per minute**\n» Whoever has the most points every **Friday** at **10:00 PM EST** will claim the ***Crown*** and all points will be reset! For more details, you can use the ``!crown`` command.\n» To check the points of yourself or someone else, use ``!points``.\n» To check the current top 10 use the ``!top10`` command, or if you want the position of someone specific you can use the ``!position`` command.\n» If you\'re feeling generous, you can even give some of your points away with ``!givepoints``!');
  }
};
