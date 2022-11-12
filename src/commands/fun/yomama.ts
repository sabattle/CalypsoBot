import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, ErrorType } from 'enums'
import fetch from 'node-fetch'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('yomama')
    .setDescription("Insults a user's mother.")
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('The user to insult the mother of.')
        .setRequired(false),
    ),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { guild } = interaction
    const { targetMember, member, targetUser, user } =
      Command.getMemberAndUser(interaction)

    try {
      const res = await fetch('https://api.yomomma.info')
      let { joke } = (await res.json()) as { joke: string }
      joke = joke.charAt(0).toLowerCase() + joke.slice(1)
      if (!joke.endsWith('!') && !joke.endsWith('.') && !joke.endsWith('"'))
        joke += '!' // Cleanup joke

      const embed = new EmbedBuilder()
        .setTitle('👩  Yo Mama  👩')
        .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
        .setDescription(`${targetMember ?? targetUser}, ${joke}`)
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
