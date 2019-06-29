// Firebase App (the core Firebase SDK) is always required and must be listed first
const firebase =  require('firebase/app')
require('firebase/auth')
require('firebase/firestore')
const firebaseConfig = require('./firebaseConfig.key.json')

const Gpio = require('onoff').Gpio
const lock = new Gpio(18, 'out')

const lockID = 'FcIL855wk4lTqLR5whUY'

function openLock(isOpen, autoCloseTimer, unsubscribe) {
  if (!isOpen) return
  lock.writeSync(1)
  console.log(`Lock is physically open: ${!!lock.readSync()}, until ${autoCloseTimer / 1000} seconds.`)
  unsubscribe()
  db.collection('locks').doc(lockID).update({ isPhysicallyOpen: lock.readSync() ? true : false })

  setTimeout(() => {
    lock.writeSync(0)
    console.log('Lock is physically closed')
    db.collection('locks').doc(lockID).update({
      isOpen: false,
      isPhysicallyOpen: lock.readSync() ? true : false
    })
    subscribe()
  }, autoCloseTimer)
}

firebase.initializeApp(firebaseConfig)
const db = firebase.firestore()

let doc = db.collection('locks').doc(lockID)
let unsubscribe

function subscribe () {
  unsubscribe = doc.onSnapshot(docSnapshot => {
    // console.log('recived update')
    if (!docSnapshot.exists) console.log('No such document!')
    else openLock(docSnapshot.data().isOpen, docSnapshot.data().autoCloseTimer, unsubscribe)
  }, err => {
    console.log('Encountered error: ', err)
  })
}

subscribe()
