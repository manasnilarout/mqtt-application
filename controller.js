// controller.js
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://0.0.0.0:1883')

var garageState = ''
var connected = false

client.on('connect', () => {
  client.subscribe('garage/connected')
  client.subscribe('garage/state')
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'garage/connected':
      return handleGarageConnected(message)
    case 'garage/state':
      return handleGarageState(message)
  }
  console.log(`No handler for topic ${topic}`)
})

function handleGarageConnected (message) {
  console.log(`garage connected status ${message}`)
  connected = (message.toString() === 'true')
}

function handleGarageState (message) {
  garageState = message.toString()
  console.log(`garage state update to ${message.toString()}`)
}

function openGarageDoor () {
  // can only open door if we're connected to mqtt and door isn't already open
  if (connected && garageState !== 'open') {
    client.publish('garage/open', 'true')
  }
}

function closeGarageDoor () {
  // can only close door if we're connected to mqtt and door isn't already closed
  if (connected && garageState !== 'closed') {
    client.publish('garage/close', 'true')
  }
}

// simulate opening garage door
setTimeout(() => {
  console.log('open door')
  openGarageDoor()
}, 5000)

// simulate closing garage door
setTimeout(() => {
  console.log('close door')
  closeGarageDoor()
}, 20000)
