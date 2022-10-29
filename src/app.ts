import { Events, GatewayIntentBits } from 'discord.js'
import config from 'config'
import Client from 'structures/Client'

const client = new Client(config, { intents: [GatewayIntentBits.Guilds] })

client.once(Events.ClientReady, () => {
  console.log('Ready!')
})
