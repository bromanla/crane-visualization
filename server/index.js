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

let healthTimer;
let fatalTimer;

parser.on('data', (data) => {
  const req = data.toString()

  if (req === 'ok') {
    // clearTimeout(fatalTimer)
    // return console.log('Связь с ардуино есть')
  }

  const degrees = req
    .split(',')
    .map(el => Number(el))

  config.debug && console.log(degrees)

  // Запускаем таймер на 10 секунд, если ответа нет, то крашим
  // clearTimeout(healthTimer)
  // healthTimer = setTimeout(() => {
  //   console.log('health')
  //   port.write('0')

  //   fatalTimer = setTimeout(() => {
  //     throw 'Аруино не отвечает!'
  //   }, 1000)
  // }, 5000);
})

port.on('error', (err) => {
  console.log(err)
})

// Function reopen port
