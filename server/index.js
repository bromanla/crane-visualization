import SerialPort from 'serialport'

// console.log(await SerialPort.list())

const port = new SerialPort('COM3', {
  baudRate: 9600,
  autoOpen: false
})

port.open((err) => {
  if (err)
    return console.log(`Error opening port: ${err.message}`)
})

let timer = new Date().getTime()

port.on('data', function (data) {
  console.log(new Date().getTime() - timer)
  timer = new Date().getTime()

  console.log('Data:', data.toString())
})
