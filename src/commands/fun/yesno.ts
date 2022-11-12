import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'
import capitalize from 'lodash/capitalize'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('yesno')
    .setDescription('Displays a gif of a yes, a no, or a maybe.'),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    try {
      const res = await fetch('http://yesno.wtf/api/')
      const json = (await res.json()) as {
        answer: string
        image: string
      }
      const answer = capitalize(json.answer)
      const { image } = json

      let title: string
      if (answer === 'Yes') title = '👍  ' + answer + '!  👍'
      else if (answer === 'No') title = '👎  ' + answer + '!  👎'
      else title = '👍  ' + answer + '?  👎'

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
        .setImage(image)
        .setFooter({
          text: member?.displayName ?? user.username,
          iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
        })
        .setTimestamp()

      await client.reply(interaction, { embeds: [embed] })
    } catch (err) {
      await client.replyWithError(
        interaction,
        ErrorType.CommandFailure,
        `Sorry ${member}, please try again later.`,
      )
    }
  },
})
