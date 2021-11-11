import config from './src/config.js'
import SerialPort from './src/serialport.js'

const port = new SerialPort(config.serialport)
await port.open()

// EventHandler для получения данных
