import config from './src/config.js'
import SerialPort from './src/serialport.js'

const port = new SerialPort(config.serialport)
port.open()

port.on('data', (data) => {
  const req = data.toString()

  const degrees = req
    .split(',')
    .map(el => Number(el))

  config.debug && console.log(degrees)
})
