import { Client } from '@structures'
import config from 'config'
import { GatewayIntentBits, Partials } from 'discord.js'

const client = new Client(config, {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
})

// Initialize bot
;(async (): Promise<void> => await client.init())()
