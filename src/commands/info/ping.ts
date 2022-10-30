import { SlashCommandBuilder } from 'discord.js'
import Command, { CommandType } from 'structures/Command'

export default new Command({
  data: new SlashCommandBuilder().setName('ping'),
  type: CommandType.Info,
  run: (): void => console.log('Pong!'),
})
