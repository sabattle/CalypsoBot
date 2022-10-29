import { config } from 'dotenv'
import { getEnvironmentVariable } from 'utils'

config()

export default {
  clientId:
    process.env.NODE_ENV == 'production'
      ? getEnvironmentVariable('CLIENT_ID')
      : getEnvironmentVariable('DEV_CLIENT_ID'),
  token:
    process.env.NODE_ENV == 'production'
      ? getEnvironmentVariable('TOKEN')
      : getEnvironmentVariable('DEV_TOKEN'),
  guildId: getEnvironmentVariable('GUILD_ID'),
}
