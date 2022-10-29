interface CommandOptions {
  name: string
  aliases: string[]
  type: string
  description: string
}

export default class Command {
  public name: string
  public aliases: string[]
  public type: string
  public description: string

  public constructor({ name, aliases, type, description }: CommandOptions) {
    this.name = name
    this.aliases = aliases
    this.type = type
    this.description = description
  }
}
