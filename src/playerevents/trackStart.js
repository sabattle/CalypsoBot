module.exports = (client, message, track) => {
    message.channel.send({
        embed: {
            color: '#A7DBFB',
            title: 'Now Playing',
            description: `[${track.title}](${track.url}) in **${message.member.voice.channel.name}**, bound to <#${message.channel.id}> | *Requested by* [<@${track.requestedBy.id}>]`
        },
    });
};