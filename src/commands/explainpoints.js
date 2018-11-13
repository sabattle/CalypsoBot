module.exports = {
  name: 'explainpoints',
  usage: '',
  description: 'Explains various aspects of the points system.',
  tag: 'general',
  run: (message) => {
    message.channel.send('Points are earned in the following ways:\nSending messages - **1 point**\nSending links or files - **15 points**\nVoice chat (AFK channel is ignored) - **1 point per minute**\nWhoever has the most points every **Friday** at **7:00 PM EST** will claim the ***Crown*** and all points will be reset! For more details, you can use the ``!crown`` command.\nTo check the points of yourself or someone else, use ``!points``.\nTo check the current top 10 use the ``!top10`` command, or if you want the position of someone specific you can use the ``!position`` command.\nIf you\'re feeling generous, you can even give some of your points away with ``!givepoints``!');
  }
};
