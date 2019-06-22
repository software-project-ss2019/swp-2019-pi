const Gpio = require('onoff').Gpio
const lock = new Gpio(21, 'out')

function toggleLock() { 
  lock.readSync() === 0 ? lock.writeSync(1) : lock.writeSync(0)
}

function endLock() {
  lock.writeSync(0)
  // Unexport GPIO to free resources
  lock.unexport()
}

console.log('*******state: ', lock.readSync())
toggleLock()
console.log('*******state: ', lock.readSync())

setTimeout(endLock, 60000)