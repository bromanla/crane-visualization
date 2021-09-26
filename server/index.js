import config from './src/config.js'
import SerialPort from 'serialport'
import ReadLine from '@serialport/parser-readline'

const port = new SerialPort(config.serialport, {
  baudRate: 9600,
  autoOpen: false
})

const parser = port.pipe(
  new ReadLine({
    delimiter: '\r\n'
  })
)

port.open(async (err) => {
  if (err) {
    const ports = await SerialPort.list()

    const message = ports.reduce(
      (acc, port, index) => acc + `\n${++index}. ${port.path}`,
      'Available ports:'
    )

    console.log(`Error opening port: ${err.message}`)
    console.log(message)
  }
})

parser.on('data', (data) => {
  const degrees = data
    .toString()
    .split(',')
    .map(el => Number(el))

  config.debug && console.log(degrees)
})
