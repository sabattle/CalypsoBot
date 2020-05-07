<h1 align="center">
  <br>
  <a href="https://github.com/sabattle/CalypsoBot"><img src="./data/images/Calypso_Title.png"></a>
  <br>
  Calypso Discord Bot
  <br>
</h1>

<h3 align=center>A multipurpose bot built with <a href=https://github.com/discordjs/discord.js>discord.js</a></h3>


<div align=center>

  <img src="https://discordapp.com/api/guilds/676596755067961372/widget.png?style=shield" alt="shield.png">

  <a href="https://github.com/discordjs">
    <img src="https://img.shields.io/badge/discord.js-v11.6.4-blue.svg?logo=npm" alt="shield.png">
  </a>

  <a href="https://github.com/sabattle/CalypsoBot/blob/develop/LICENSE">
    <img src="https://img.shields.io/badge/license-GNU%20GPL%20v3-green" alt="shield.png">
  </a>

</div>

<p align="center">
  <a href="#features">Features</a>
  •
  <a href="#installation">Installation</a>
  •
  <a href="#set-up">Set Up</a>
  •
  <a href="#colors">Colors</a>
  •
  <a href="#license">License</a>
  •
  <a href="#credits">Credits</a>
</p>

## Features

  * Moderation commands with optional logging
  * Fun commands, including trivia
  * General/utility commands
  * Points system with leaderboards and a rotating winner
  * Cat & dog pics
  * Color system
  * Per server customization
  * And much more!

## Installation

You can add Calypso to your server with [this](https://discordapp.com/oauth2/authorize?client_id=416451977380364288&scope=bot&permissions=281242711) link! Alternatively, you can feel free to clone this repo and host the bot yourself.
```
git clone https://github.com/sabattle/Calypso
```
After cloning, run an
```
npm install
```
to snag all of the dependencies. Of course, you need [node](https://nodejs.org/en/) installed. I also strongly recommend [nodemon](https://www.npmjs.com/package/nodemon) as it makes testing *much* easier.

## Set Up

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
Visit the Discord [developer portal](https://discordapp.com/developers/applications/) to create an app and use the client token you are given for the ``token`` option. ``ownerId`` is your own Discord snowflake. To get keys for supported APIs, vist:

  * [TheCatAPI](https://thecatapi.com/)
  * [Google APIs](https://console.developers.google.com/apis/)

Once done, feel free to launch Calypso using the command ``node app.js`` or ``nodemon app.js``. If on Linux, you can also kick off using the ``start.sh`` script.

### Colors

To have colors on your server, first create a bunch of empty roles at the bottom of your server's role heirarchy. The names of these roles must begin with the character ``#``, for example, ``#Red`` or ``#Blue``. Then change the color of that role to your desired hex, and that's it!  Or, use the provided ``createcolor`` command to quickly and easily create new colors. After they are set up, the members of your server can then change their color by using Calypso's color commands! Credit to [Threebow](https://github.com/Threebow) for the idea.

## To-Do

Calypso is in a continuous state of development. New features/updates may come at any time. Some pending ideas are:

  * Stream alerts
  * Custom tag/reaction system

## License

Released under the [GNU GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html) license.

## Credits

* **Sebastian Battle** - *Initial work* - [github](https://github.com/sabattle)
* **Kyle Glaws** - [github](https://github.com/krglaws)
* **CommradeFido#5286** - *All art and graphics*
* **Red Discord Bot** - *Initial trivia* - [github](https://github.com/Cog-Creators/Red-DiscordBot/blob/V3/develop/README.md#join-the-community)
* **Threebow** - *Ideas and tutorials* - [github](https://github.com/Threebow)