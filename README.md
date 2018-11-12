# Calypso

Calypso is Discord bot built with [discord.js](https://github.com/discordjs/discord.js) that started out as a side project, but has now morphed into something much more. She is a multi-purpose bot with commands ranging from message deletion to random dog pics! Calypso was designed with flexibility in mind, making it very easy to modify existing features or add new ones. Currently a WIP.

## Features

  * Moderation commands
  * Fun commands, including games
  * Stream alerts
  * Points system with weekly "crown"
  * General commands
  * Cat & dog pics
  * Color system
  * Secret reactions

## Getting Started

You can add Calypso to your server with [this](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=1513483350) link! Alternatively, you can feel free to clone this repo and host the bot yourself.
```
git clone https://github.com/sabattle/Calypso
```

### Installation

After cloning, run an
```
npm install
```
to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing *much* easier.

### Setting Up

You have to create a ``config.json`` file in order to run the bot (you can use the example file provided as a base). Your file should look something like this:
```
{
  "token": "",
  "prefix": "",
  "ownerID": "",
  "devChannelID": "",
  "color": ""
}
```
Visit the Discord [developer portal](https://discordapp.com/developers/applications/) to create an app and use the client token you are given for the ``token`` option. ``ownerID`` and ``devChannelID`` are your ID and your server's development text channel, respectively. ``prefix`` should be a character you want to come before any commands, and ``color`` should be a hex of a color you want to show up on certain responses.

### Colors

To have colors on your server, first create a bunch of empty roles on your server that begin with #. Then change the color of that role to the desired color. For example, ``#Red`` or ``#Blue``. The members of your server can then change their color by using Calypso's color commands! Credit to [Threebow](https://github.com/Threebow) for the idea.

## Authors

* **Sebastian Battle** - *Initial work* - [github](https://github.com/sabattle)
* **Kyle Glaws** - [github](https://github.com/krglaws)

## License

MIT

## To-Do

* Music/DJ functionality
* Trivia
