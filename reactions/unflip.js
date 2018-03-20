module.exports = {
  name: "unflip",
  prompt: "(╯°□°）╯︵ ┻━┻",
  run: (bot, message) => {
    message.channel.send(`┬─┬﻿ ノ( ゜-゜ノ)\n\n${message.member.displayName}, please respect tables.`);
  }
}
