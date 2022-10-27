import { Events } from 'discord.js'
import config from 'config'
import { Client } from 'Client'

const { token, intents } = config
const client = new Client({ intents })

client.once(Events.ClientReady, () => {
  console.log('Ready!')
})

client.login(token)
