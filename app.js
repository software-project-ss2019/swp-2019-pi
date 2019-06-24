// Firebase App (the core Firebase SDK) is always required and must be listed first
const firebase =  require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
const firebaseConfig = require('./firebaseConfig.key.json')

const Gpio = require('onoff').Gpio
const lock = new Gpio(21, 'out')

function toggleLock() { 
  lock.readSync() === 0 ? lock.writeSync(1) : lock.writeSync(0)
}

console.log('State: ', lock.readSync())
toggleLock()
console.log('State: ', lock.readSync())

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

let doc = db.collection('users').doc('demZ1b8ebrO8WPRObVsY')

let observer = doc.onSnapshot(docSnapshot => {
  console.log('Received doc snapshot: ', docSnapshot)
  // ...
}, err => {
  console.log('Encountered error: ', err)
})
