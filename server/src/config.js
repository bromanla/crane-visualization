import dotenv from 'dotenv'

const { error } = dotenv.config()

if (error) {
  throw new Error('Couldn\'t find .env file')
}

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

export default {
  port: Number(process.env.PORT),
  serialport: process.env.SERIALPORT,
  debug: process.env.DEBUG === '1' ? true : false
}
