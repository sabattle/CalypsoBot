import { CommandInteraction, type SlashCommandBuilder } from 'discord.js'
import Client from 'structures/Client'

export enum CommandType {
  Info = 'info',
}

type RunFunction = (
  client: Client,
  interaction: CommandInteraction,
) => Promise<void> | void

interface CommandOptions {
  data: SlashCommandBuilder
  type: CommandType
  run: RunFunction
}

type ICommand = CommandOptions

export default class Command implements ICommand {
  public data: SlashCommandBuilder
  public type: CommandType
  public run: RunFunction

  public constructor({ data, type, run }: CommandOptions) {
    this.data = data
    this.type = type
    this.run = run
  }
}
