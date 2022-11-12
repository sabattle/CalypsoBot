import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('bird')
    .setDescription('Displays a random bird.'),
  type: CommandType.Animals,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    try {
      const res = await fetch('http://shibe.online/api/birds')
      const image = ((await res.json()) as string[])[0]

      const embed = new EmbedBuilder()
        .setTitle('🐦  Chirp!  🐦')
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
