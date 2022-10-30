import { Events } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'
import { client } from 'app'

export default new Event(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  const command = client.commands.get(interaction.commandName)

  if (!command) return

  try {
    await command.run(client, interaction)
  } catch (err) {
    if (err instanceof Error) logger.error(err.stack)
    else logger.error(err)
  }
})
