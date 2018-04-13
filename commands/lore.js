const voiceChannels = [ //hardcoded @ Mitchelson
    {
      name: "AIUR",
      description: "**Aiur** is a planet in the StarCraft universe. It is the homeworld of the protoss, a humanoid race with incredibly advanced technology and psionic mastery. The protoss draw their energy from a great psionic matrix on Aiur, which they link to with a structure called a nexus. Aiur has great significance to the protoss, and is revered in an almost spiritual sense."
    },
    {
      name: "DELFINO",
      description: "**Isle Delfino** is a tropical paradise from the game Mario Sunshine. It is the home to the Piantas and the Nokis, and is initially in great peril. Through the help of his newly acquired ally F.L.U.D.D., Mario is able to fight back against the mysterious graffiti plaguing the island. The island has a variety of landmarks, the most iconic being Delfino Plaza."
    },
    {
      name: "HANAMURA",
      description: "**Hanamura** is a map from the game Overwatch. It is a small village located in Japan, and is the ancestral home of the Shimada ninja clan, which Hanzo and Genji belong to. It is best known for its idyllic cherry blossom festival every spring. Over time, it has become a very popular tourist destination because of its shops, restaurants, and historic temple grounds."
    },
    {
      name: "KAME HOUSE",
      description: "**The Kame House** is the home of Master Roshi in the Dragon Ball universe. Master Roshi is the founder of the Turtle School, which Goku and Krillin belong to. The signature move of the Turtle School is the Kamehameha. The house itself is located on a small island in the middle of the ocean, where Master Roshi spends most of the day looking at pornographic magazines."
    },
    {
      name: "LION'S ARCH",
      description: "**Lion's Arch** is the melting pot of Tyria. It is commonly known as the main hub of the MMO Guild Wars 2. In 1327 AE, the city was razed to the ground by the villian Scarlet Briar. It has since been rebuilt, officially finishing construction one year after it was destroyed. Lion's Arch is now back to its former glory, and a variety of activities and events can be found there throughout the year."
    },
    {
      name: "POCHINKI",
      description: "**Pochinki** is a major city on the map Erangel in the game PlayerUnknown's Battlegrounds. It is known for being a common drop location for players because of the value of its loot. It is high-risk, high-reward. In real life, Pochinki is a small village in the Mordovia region in Russia."
    },
    {
      name: "RAPTURE",
      description: "**Rapture** is a massive underwater city from the Bioshock series. It was developed by the extremist Andrew Ryan, who wanted a society purely founded on capitalist ideology and personal freedoms. Unfortunely, due to the spread of an addicting and gene altering subtance known as ADAM, the city deteriorates.The city is known for its religious fanaticism, and is the home of the Splicers, the Big Daddies, and the Little Sisters."
    },
    {
      name: "UNDERCITY",
      description: "**The Undercity** is the capital city of the undead in the MMO World of Warcraft. It is located in Tirisfal Glades, at th northern edge of the Eastern Kingdoms. The city itself can be found in the crypts beneath the ruined capital city of Lordaeron. It serves as the central hub for the undead, who belong to the Horde faction."
    }
]; //i should probably put this ish in a json file

module.exports = {
  name: "lore",
  usage: "<VOICE CHANNEL>",
  description: "Fetches lore about the specified voice channel.",
  tag: "fun",
  run: (bot, message, args) => {
    let target = args.join(" ").toUpperCase();
    target = voiceChannels.find(e => target.startsWith(e.name));
    if (!target) message.channel.send(`Sorry ${message.member.displayName}, I don't recognize that channel.`);
    else message.channel.send(target.description);
  }
}
