import config from './config.js'
import SerialPort from 'serialport'
import ReadLine from '@serialport/parser-readline'
import EventEmitter from 'events'
import { setTimeout } from 'timers/promises'

export default class {
  cache = ''

  constructor (path) {
    this.path = path
    this.emitter = new EventEmitter()
    this.open()
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

    parser.on('data', this.data.bind(this))
    port.on('close', this.close.bind(this))

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

  close () {
    config.debug && console.log('Connection lost. Attempt to reconnect')
    this.open()
  }

  data (data) {
    const degrees = data
      .split(',')
      .map(el => Number(el))

    if (this.cache === degrees.toString()) {
      return console.log('Повторение')
    }

    if (degrees.length === 3 && degrees.every(el => !isNaN(el))) {
      this.emitter.emit('data', degrees)
      this.cache = degrees.toString()
    }

  }

  on (event, callback) {
    return this.emitter.on(event, callback)
  }
}
