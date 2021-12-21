import logger from './logger.js'
import SerialPort from 'serialport'
import ReadLine from '@serialport/parser-readline'
import EventEmitter from 'events'
import { setTimeout } from 'timers/promises'

export default class {
  cache = ''
  tmpFilter = []

  constructor (path) {
    this.path = path
    this.emitter = new EventEmitter()
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
        logger.error(`Error opening port: ${err.message}`)
        logger.debug('Attempt to reconnect after 5 seconds')
        await setTimeout(5000)
        this.open()
      }
      else {
        logger.debug('Port open')
      }
    })
  }

  close () {
    this.emitter.emit('close')
    logger.error('Connection lost. Attempt to reconnect')
    this.open()
  }

  // arithmetic average of the last (5) value
  filter (degrees) {
    if (this.tmpFilter.length >= 5) {
      this.tmpFilter.shift()
    }

    this.tmpFilter.push(degrees)

    const average = this.tmpFilter
      .reduce((acc, el) => {
        for(let i in acc) {
          acc[i] += el[i]
        }

        return acc
      }, [0, 0, 0])
      .map(el =>  Math.round(el / this.tmpFilter.length))

    return average
  }

  data (data) {
    const degrees = data
      .split(',')
      .map(el => Number(el))

    if (degrees.length === 3 && degrees.every(el => !isNaN(el))) {
      const filtered = this.filter(degrees)

      if (filtered.toString() === this.cache)
        return logger.debug('data unchanged')

      this.cache = filtered.toString()
      this.emitter.emit('data', degrees)
      logger.debug(degrees)
    }
  }

  on (event, callback) {
    return this.emitter.on(event, callback)
  }
}
