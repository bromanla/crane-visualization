import config from './config.js'
import logger from './logger.js'
import SerialPort from './serialport.js'
import { WebSocketServer } from 'ws'

const port = new SerialPort(config.serialport)
const wss = new WebSocketServer({ port: config.port })

port.open()

wss.on('connection', (ws) => {
  const length = port.tmpFilter.length;

  // send last values if they exist
  if (length !== 0) {
    ws.send(serialization('ok', port.tmpFilter[length - 1]))
  }

  logger.info('Client connected!')
})

port.on('data', (data) => {
   wss.clients.forEach((client) => {
    client.send(serialization('ok', data))
  })
})

port.on('close', (data) => {
  wss.clients.forEach((client) => {
    client.send(serialization('close', data))
  })
})

const serialization = (event, data) => JSON.stringify({ event, data })
