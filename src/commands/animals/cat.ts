import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('cat')
    .setDescription('Displays a random cat.'),
  type: CommandType.Animals,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    try {
      const api = 'https://cataas.com/cat'
      const res = await fetch(`${api}?json=true`)
      const id = ((await res.json()) as { _id: string })._id
      const image = api + '/' + id

      const embed = new EmbedBuilder()
        .setTitle('🐱  Meow!  🐱')
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
