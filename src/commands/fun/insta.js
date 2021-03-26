const Command = require('../Command.js');
const fetch = require('node-fetch')

module.exports = class InstaCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'insta',
      usage: 'insta <user>',
      description: 'know information about someone\'s instagram',
      type: client.types.FUN
    });
  }
  async run(message, args) {
    const name = args.join(" ");

    if (!name) {
        return message.reply("Maybe it's useful to actually search for someone...!")
            .then(m => m.delete(5000));
    }

    const url = `https://instagram.com/${name}/?__a=1`;
    
    let res; 

    try {
        res = await fetch(url).then(url => url.json());
    } catch (e) {
        return message.reply("I couldn't find that account... :(")
            .then(m => m.delete(5000));
    }

    const account = res.graphql.user;

    const embed = new MessageEmbed()
        .setColor("GREEN")
        .setTitle(account.full_name)
        .setURL(`https://instagram.com/${name}`)
        .setThumbnail(account.profile_pic_url_hd)
        .setDescription("Profile information")
        .addField("**Username**", `${account.username}`)
        .addField("**Full name**", `${account.full_name}`)
        .addField("**Biography**", `${account.biography.length == 0 ? "none" : account.biography}`)
        .addField("**Posts**", `${account.edge_owner_to_timeline_media.count}`)
        .addField("**Followers**", `${account.edge_followed_by.count}`)
        .addField("**Following**", `${account.edge_follow.count}`)
        .addField("**Private account**", `${account.is_private ? "Yes 🔐" : "Nope 🔓"}`);

    message.channel.send(embed);
}
}