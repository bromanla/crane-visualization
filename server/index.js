import config from './src/config.js'
import SerialPort from './src/serialport.js'
import { WebSocketServer } from 'ws'

const port = new SerialPort(config.serialport)
const wss = new WebSocketServer({ port: config.port })

wss.on('connection', (ws) => {
  console.log('Client connected!')
})

port.on('data', (data) => {
  console.log(data)

  wss.clients.forEach((client) => {
    client.send(
      JSON.stringify(data)
    )
  })
})
