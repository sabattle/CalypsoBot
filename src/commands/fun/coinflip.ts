import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('coinflip')
    .setDescription('Flips a coin.'),
  type: CommandType.Fun,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setTitle('🪙  Coinflip  🪙')
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription(
        `I flipped a coin for you, ${member}! It was **${
          Math.round(Math.random()) ? 'heads' : 'tails'
        }**.`,
      )
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
