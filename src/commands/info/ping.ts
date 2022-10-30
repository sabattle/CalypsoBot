import { SlashCommandBuilder } from 'discord.js'
import Command, { CommandType } from 'structures/Command'

export default new Command({
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Gets bots current ping.'),
  type: CommandType.Info,
  run: async (client, interaction): Promise<void> => {
    await interaction.reply('Pong!')
  },
})
