import dotenv from 'dotenv'

const { error } = dotenv.config()

if (error) {
  throw new Error('Couldn\'t find .env file')
}

export default {
  port: process.env.PORT,
  serialport: process.env.SERIALPORT,
  debug: process.env.DEBUG === '1' ? true : false
}
