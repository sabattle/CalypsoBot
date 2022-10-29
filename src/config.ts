import { config } from 'dotenv'
import { getEnvironmentVariable } from 'utils'

config()

export default {
  token: getEnvironmentVariable('TOKEN'),
  name: getEnvironmentVariable('NAME'),
}
