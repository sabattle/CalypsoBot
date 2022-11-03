import { Events, PermissionsBitField } from 'discord.js'
import logger from 'logger'
import Event from 'structures/Event'
import { client } from 'app'
import { ErrorType } from 'structures/enums'
import startCase from 'lodash/startCase'

export default new Event(Events.InteractionCreate, async (interaction) => {
  if (!client.isReady() || !interaction.isChatInputCommand()) return

  const command = client.commands.get(interaction.commandName)

  // Return if no command
  if (!command) return

  // Reply with error if missing permissions and return
  if (interaction.inCachedGuild()) {
    const permissions =
      interaction.channel
        ?.permissionsFor(client.user)
        ?.missing(command.permissions)
        .map((p) => startCase(String(new PermissionsBitField(p).toArray()))) ||
      []
    if (permissions.length != 0) {
      try {
        await client.replyWithError(
          interaction,
          ErrorType.MissingPermissions,
          `Sorry ${
            interaction.member
          }, I need the following permissions for this command:\n \`\`\`diff\n- ${permissions.join(
            '\n- ',
          )}\`\`\``,
        )
      } catch (err) {
        if (err instanceof Error) logger.error(err.message)
        else logger.error(err)
      }
      return
    }
  }

  // Run command
  try {
    await command.run(client, interaction)
  } catch (err) {
    if (err instanceof Error) logger.error(err.stack)
    else logger.error(err)
  }
})
