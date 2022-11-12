import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { Color, CommandType, Emoji } from 'enums'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription("Gets the bot's current ping."),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild, createdTimestamp } = interaction
    const { member } = Command.getMember(interaction)

    const embed = new EmbedBuilder()
      .setColor(guild?.members.me?.displayHexColor ?? Color.Default)
      .setDescription('`Pinging...`')

    const message = await client.reply(interaction, {
      embeds: [embed],
      fetchReply: true,
    })

    const heartbeat = `\`\`\`ini\n[ ${Math.round(client.ws.ping)}ms ]\`\`\``
    const latency = `\`\`\`ini\n[ ${Math.floor(
      message.createdTimestamp - createdTimestamp,
    )}ms ]\`\`\``

    embed
      .setTitle(`Pong  ${Emoji.Pong}`)
      .setDescription(null)
      .addFields(
        { name: 'Heartbeat', value: heartbeat, inline: true },
        { name: 'API Latency', value: latency, inline: true },
      )
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.editReply(interaction, { embeds: [embed] })
  },
})
