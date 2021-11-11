import config from './config.js'
import SerialPort from 'serialport'
import ReadLine from '@serialport/parser-readline'
import { setTimeout } from 'timers/promises'

export default class {
  constructor (path) {
    this.path = path
  }

  async open() {
    const port = new SerialPort(this.path, {
      baudRate: 9600,
      autoOpen: false
    })

    const parser = port.pipe(
      new ReadLine({
        delimiter: '\r\n'
      })
    )

    parser.on('data', (data) => this.onData(data))
    port.on('close', () => this.onClose())
    port.on('error', (e) => this.onError(e))

    this.port = port
    this.parser = parser

    this.port.open(async (err) => {
      if (err) {
        console.log(`Error opening port: ${err.message}`)
        console.log('Attempt to reconnect after 5 seconds')
        await setTimeout(5000)
        await this.open()
      }
      else {
        config.debug && console.log('Port open!')
      }
    })
  }

  async onClose () {
    config.debug && console.log('Connection lost. Attempt to reconnect')
    await this.open()
  }

  async onError (e) {
    console.log(`on error`)
  }

  onData (data) {
    const req = data.toString()

    const degrees = req
      .split(',')
      .map(el => Number(el))

    config.debug && console.log(degrees)
  }

}

// const ports = await SerialPort.list()

// const message = ports.reduce(
//   (acc, port, index) => acc + `\n${++index}. ${port.path}`,
//   'Available ports:'
// )
