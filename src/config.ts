import { GatewayIntentBits } from 'discord.js'
import { config } from 'dotenv'

config()

export default {
  env: process.env.ENV,
  token: process.env.TOKEN,
  intents: [GatewayIntentBits.Guilds],
  name: process.env.NAME,
  prefix: process.env.PREFIX,
}
