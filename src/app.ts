import config from 'config'
import { GatewayIntentBits } from 'discord.js'
import Client from 'structures/Client'

const client = new Client(config, { intents: [GatewayIntentBits.Guilds] })

// Initializes the bot
;(async (): Promise<void> => await client.init())()
