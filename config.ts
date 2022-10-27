import { config } from 'dotenv'

config()

export default {
  env: 'development',
  token: process.env.TOKEN,
  intents: [
    'GUILDS',
    'GUILD_MESSAGES',
    'GUILD_MEMBERS',
    'GUILD_PRESENCES',
    'GUILD_MESSAGE_REACTIONS',
  ],
  name: 'Calypso',
  prefix: '!',
}
