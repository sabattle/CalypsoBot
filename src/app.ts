import { GatewayIntentBits } from 'discord.js'
import config from 'config'
import Client from 'structures/Client'

const client = new Client(config, { intents: [GatewayIntentBits.Guilds] })

;(async (): Promise<void> => await client.init())()
