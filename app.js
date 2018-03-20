const Discord = require("discord.js");
const fs = require("fs");
const sqlite = require("sqlite");
sqlite.open("./db.sqlite");

const bot = new Discord.Client();
bot.token = require("./config.json").token;
bot.prefix = require("./config.json").prefix;
bot.ownerID = require("./config.json").ownerID;
bot.defaultChannelID = require("./config.json").defaultChannelID;
bot.color = "#B7C96D";
bot.commands = new Discord.Collection();
bot.reactions = new Discord.Collection();

//load commands
fs.readdir("./commands/", (err, files) => {
  if (err) console.error(err);
  files = files.filter(f => f.split(".").pop() === "js"); //filter for js files
  if (files.length === 0) return console.log("No commands found.");
  console.log(`${files.length} command(s) found...`);
  files.forEach(f => {
    let command = require(`./commands/${f}`);
    console.log(`Loading command: ${command.name}.`);
    bot.commands.set(command.name, command);
  });
});

//load reactions
fs.readdir("./reactions/", (err, files) => {
  if (err) console.error(err);
  files = files.filter(f => f.split(".").pop() === "js"); //^^
  if (files.length === 0) return console.log("No reactions found.");
  console.log(`${files.length} reaction(s) found...`);
  files.forEach(f => {
    let reaction = require(`./reactions/${f}`);
    console.log(`Loading reaction: ${reaction.name}.`);
    bot.reactions.set(reaction.name, reaction);
  });
});

//ready event
bot.on("ready", () => {
  console.log(`Booted up successfully. Calypso is now online.`);
  bot.user.setPresence({ status: "online", game: { name: "your commands", type: 2 } });
});

//member add event
bot.on("guildMemberAdd", member => {
  bot.channels.get(bot.defaultChannelID).send(`Welcome to Atlas, ${member}! Here's what you need to know:
  » "${bot.prefix}" is the prefix for my commands.
  » Type \`${bot.prefix}help\` to get a list of everything I can do!
  » Commands don't work in DM. Sorry :cold_sweat:
  » Have fun!`);
});

//presence update event
bot.on("presenceUpdate", (oldMember, newMember) => {
  if (oldMember.presence.game){
    if (oldMember.presence.game.streaming === true) return;
  }
  if (newMember.presence.game){
    if (newMember.presence.game.streaming === true) bot.channels.get(bot.defaultChannelID).send(`${newMember.displayName} is now streaming! Here's a link: <${newMember.presence.game.url}>`);
  }
});

//message event
bot.on("message", async message => {
  //checks
  if (message.channel.type === "dm" || message.author.bot) return;
  //command handler
  if (message.content.charAt(0) === bot.prefix){
    let args = message.content.trim().split(/ +/g);
    let command = bot.commands.get(args.shift().slice(bot.prefix.length).toLowerCase());
    if (command) command.run(bot, message, args);
  }
  else {
    let reaction = bot.reactions.find("prompt", message.content);
    if (reaction) reaction.run(bot, message);
  }
  //database
  try {
    let row = await sqlite.get(`SELECT * FROM db WHERE userId ="${message.author.id}"`);
    if (!row) sqlite.run("INSERT INTO db (userId, points) VALUES (?, ?)", [message.author.id, 1]);
    else sqlite.run(`UPDATE db SET points = ${row.points + 1} WHERE userId = ${message.author.id}`);
  }
  catch(err) {
    console.log(err.message);
    await sqlite.run("CREATE TABLE IF NOT EXISTS db (userId TEXT, points INTEGER)");
    sqlite.run("INSERT INTO db (userId, points) VALUES (?, ?)", [message.author.id, 1]);
  }
});

//login
bot.login(bot.token);
