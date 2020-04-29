# Calypso

Calypso is a multipurpose Discord bot built with [discord.js](https://github.com/discordjs/discord.js).

## Features

  * Moderation commands with optional logging
  * Fun commands, including trivia
  * General/utility commands
  * Points system with leaderboards and a rotating winner
  * Cat & dog pics
  * Color system
  * Per server customization
  * And much more!

## Getting Started

You can add Calypso to your server with [this](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=281242711) link! Alternatively, you can feel free to clone this repo and host the bot yourself.
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
  "token": "your_token_here",
  "ownerId": "your_ID_here",
  "apiKeys": {
    "catApi": "your_API_key_here",
    "googleApi": "your_API_key_here"
}
```
Visit the Discord [developer portal](https://discordapp.com/developers/applications/) to create an app and use the client token you are given for the ``token`` option.

### Colors

To have colors on your server, first create a bunch of empty roles at the bottom of your server's role heirarchy. The names of these roles must begin with the character ``#``, for example, ``#Red`` or ``#Blue``. Then change the color of that role to your desired hex, and that's it!  Or, use the provided ``createcolor`` command to quickly and easily create new colors. After they are set up, the members of your server can then change their color by using Calypso's color commands! Credit to [Threebow](https://github.com/Threebow) for the idea.

## To-Do

Calypso is in a continuous state of development. New features/updates may come at any time. Some pending ideas are:

  * Stream alerts
  * Custom tag/reaction system

## Authors

* **Sebastian Battle** - *Initial work* - [github](https://github.com/sabattle)
* **Kyle Glaws** - [github](https://github.com/krglaws)

## License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

