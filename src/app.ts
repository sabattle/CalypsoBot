import config from 'config'
import { GatewayIntentBits } from 'discord.js'
import Client from 'structures/Client'

export const client = new Client(config, {
  intents: [GatewayIntentBits.Guilds],
})

// Initialize bot
;(async (): Promise<void> => await client.init())()
