import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('wholesomememe')
    .setDescription(
      'Displays a random meme from the "wholesomememes" subreddit.',
    ),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    try {
      const res = await fetch(
        'https://meme-api.herokuapp.com/gimme/wholesomememes',
      )
      const { title, url } = (await res.json()) as {
        title: string
        url: string
      }

      const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
        .setImage(url)
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
