module.exports = {
  name: 'unflip',
  prompt: '(╯°□°）╯︵ ┻━┻',
  run: (message) => {
    message.channel.send(`┬─┬﻿ ノ( ゜-゜ノ)\n\n${message.member.displayName}, please respect tables.`);
  }
};
