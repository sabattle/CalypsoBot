import { Events } from 'discord.js'
import Event from 'structures/Event'

export default new Event(Events.ClientReady, () => {
  console.log('Ready!')
})
