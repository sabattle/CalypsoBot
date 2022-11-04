import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import Command from 'structures/Command'
import { CommandType, ErrorType } from 'structures/enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('dogfact')
    .setDescription('Gets a random dog fact.'),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const member = interaction.inCachedGuild() ? interaction.member : undefined

    try {
      const res = await fetch('https://dog-api.kinduff.com/api/facts')
      const fact = ((await res.json()) as { facts: string[] }).facts[0]

      const embed = new EmbedBuilder()
        .setTitle('🐶  Dog Fact  🐶')
        .setColor(
          guild?.members.me?.displayHexColor ||
            client.user?.hexAccentColor ||
            null,
        )
        .setDescription(fact)
        .setFooter({
          text: member?.displayName || user.username,
          iconURL: member?.displayAvatarURL() || user.displayAvatarURL(),
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
