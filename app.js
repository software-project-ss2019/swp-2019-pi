// Firebase App (the core Firebase SDK) is always required and must be listed first
const firebase =  require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
const firebaseConfig = require('./firebaseConfig.key.json')

const Gpio = require('onoff').Gpio
const lock = new Gpio(18, 'out')

const lockID = 'FcIL855wk4lTqLR5whUY'

function toggleLock(state) {
  state ? lock.writeSync(1) : lock.writeSync(0)
  console.log('Lock is isPhysicallyOpen: ', !!lock.readSync())
  db.collection('locks').doc(lockID).update({ isPhysicallyOpen: lock.readSync() ? true : false })
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

let doc = db.collection('locks').doc(lockID)

let observer = doc.onSnapshot(docSnapshot => {
  console.log('recived update')
  if (!docSnapshot.exists) console.log('No such document!')
  else toggleLock(docSnapshot.data().isOpen)
}, err => {
  console.log('Encountered error: ', err)
})
