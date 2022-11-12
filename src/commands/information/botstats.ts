import { stripIndent } from 'common-tags'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Command } from '@structures'
import { CommandType } from 'enums'
import os from 'os'

// eslint-disable-next-line import/no-named-as-default-member
dayjs.extend(duration)

export default new Command({
  data: new SlashCommandBuilder()
    .setName('botstats')
    .setDescription('Displays bot statistics.'),
  type: CommandType.Information,
  run: async (client, interaction): Promise<void> => {
    const { user, guild } = interaction
    const { member } = Command.getMember(interaction)
    const { guilds, channels, ws, uptime, commands } = client

    // Get bot uptime
    const d = dayjs.duration(uptime)
    const days = `${d.days()} day${d.days() == 1 ? '' : 's'}`
    const hours = `${d.hours()} hour${d.hours() == 1 ? '' : 's'}`

    // Build stats
    const clientStats = stripIndent`
      Servers   :: ${guilds.cache.size}
      Users     :: ${guilds.cache.reduce(
        (acc, guild) => acc + guild.memberCount,
        0,
      )}
      Channels  :: ${channels.cache.size}
      WS Ping   :: ${Math.round(ws.ping)}ms
      Uptime    :: ${days} and ${hours}
    `
    const serverStats = stripIndent`
      Platform  :: ${os.platform()}
      OS        :: ${os.release()}
      Arch      :: ${os.arch()}
      Hostname  :: ${os.hostname()}
      CPUs      :: ${[...new Set(os.cpus().map((x) => x.model))].join(',')}
      Cores     :: ${os.cpus().length.toString()}
      RAM Total :: ${(os.totalmem() / 1024 / 1024).toFixed(2)} MB
      RAM Free  :: ${(os.freemem() / 1024 / 1024).toFixed(2)} MB
      RAM Usage :: ${((1 - os.freemem() / os.totalmem()) * 100).toFixed(2)}%
      Uptime    :: ${dayjs.duration(os.uptime()).days()} day(s)
    `

    const embed = new EmbedBuilder()
      .setTitle(
        `${
          guild?.members.me?.displayName ?? client.user.username
        }'s Statistics`,
      )
      .setColor(
        guild?.members.me?.displayHexColor ??
          (await client.user.fetch(true)).hexAccentColor ??
          null,
      )
      .addFields([
        {
          name: 'Commands',
          value: `\`${commands.size}\` commands`,
          inline: true,
        },
        {
          name: 'Command Types',
          value: `\`${Object.keys(CommandType).length}\` command types`,
          inline: true,
        },
        {
          name: 'Bot Stats',
          value: `\`\`\`asciidoc\n${clientStats}\`\`\``,
        },
        { name: 'Host Stats', value: `\`\`\`asciidoc\n${serverStats}\`\`\`` },
      ])
      .setFooter({
        text: member?.displayName ?? user.username,
        iconURL: member?.displayAvatarURL() ?? user.displayAvatarURL(),
      })
      .setTimestamp()

    await client.reply(interaction, { embeds: [embed] })
  },
})
