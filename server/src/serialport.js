import config from './config.js'
import SerialPort from 'serialport'
import ReadLine from '@serialport/parser-readline'
import { setTimeout } from 'timers/promises'

export default class {
  constructor (path) {
    this.path = path
  }

  open() {
    const port = new SerialPort(this.path, {
      baudRate: 9600,
      autoOpen: false
    })

    const parser = port.pipe(
      new ReadLine({
        delimiter: '\r\n'
      })
    )

    port.on('close', this.onClose.bind(this))

    this.port = port
    this.parser = parser

    this.port.open(async (err) => {
      if (err) {
        console.log(`Error opening port: ${err.message}`)
        console.log('Attempt to reconnect after 5 seconds')
        await setTimeout(5000)
        this.open()
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

  on (event, callback) {
    return this.parser.on(event, callback)
  }
}

// TODO: собственный Eventhandler
