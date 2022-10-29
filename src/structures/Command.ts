interface CommandOptions {
  name: string
}

export default class Command {
  public name: string

  public constructor({ name }: CommandOptions) {
    this.name = name
  }
}
