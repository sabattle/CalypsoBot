import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('catfact')
    .setDescription('Gets a random cat fact.'),
  type: CommandType.Animals,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    try {
      const res = await fetch('https://catfact.ninja/fact')
      const { fact } = (await res.json()) as { fact: string }

      const embed = new EmbedBuilder()
        .setTitle('🐱  Cat Fact  🐱')
        .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
        .setDescription(fact)
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
