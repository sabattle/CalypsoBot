module.exports = {
  name: 'explainpoints',
  usage: '',
  description: 'Explains various aspects of the points system.',
  tag: 'fun',
  run: (message) => {
    message.channel.send('Points are earned in the following ways:\n__Sending messages__ - **1 point**\n__Sending links or files__ - **10 points**\n__Voice chat (AFK channel is ignored)__ - **1 point per minute**\n» Whoever has the most points every **Friday** at **10:00 PM EST** will claim the ***Crown*** and all points will be reset! For more details, you can use the ``!crown`` command.\n» To check the points of yourself or someone else, use ``!points``.\n» To check the current top 10 use the ``!top10`` command, or if you want the position of someone specific you can use the ``!position`` command.\n» If you\'re feeling generous, you can even give some of your points away with ``!givepoints``!');
  }
};
