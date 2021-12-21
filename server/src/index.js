import config from './config.js'
import logger from './logger.js'
import SerialPort from './serialport.js'
import { WebSocketServer } from 'ws'

const port = new SerialPort(config.serialport)
const wss = new WebSocketServer({ port: config.port })

port.open()

wss.on('connection', () => {
  logger.info('Client connected!')
})

port.on('data', (data) => {
  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify(data)
    )
  })
})
