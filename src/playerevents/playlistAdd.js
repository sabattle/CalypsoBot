module.exports = (client, message, queue, playlist) => {
    message.channel.send ({
		embed: {
			color: '#A7DBFB',
			description: `${playlist.title} has been added to the queue (**${playlist.tracks.length}** songs) !`
		}
	})
};