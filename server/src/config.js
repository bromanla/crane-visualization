import dotenv from 'dotenv'

const { error } = dotenv.config()

if (error) {
  throw new Error('Couldn\'t find .env file')
}

const LoggerInstance = {
  port: process.env.PORT,
  serialport: process.env.SERIALPORT,
  debug: process.env.NODE_ENV !== 'production'
}

export default LoggerInstance
