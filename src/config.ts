import { config } from 'dotenv'
import { getEnvironmentVariable } from 'utils'

config()

export default {
  token: getEnvironmentVariable('TOKEN'),
  clientId: getEnvironmentVariable('CLIENT_ID'),
  guildId: getEnvironmentVariable('GUILD_ID'),
}
