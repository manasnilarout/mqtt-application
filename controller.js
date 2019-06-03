const mqtt = require('mqtt');
const client = mqtt.connect('mqqt://127.0.0.1');

// constants
const IDEAL_TIME_OUT = 5000;
const TRUE_STATUS = 'true';
const CONNECTED_STATUS = 'connected';
const OPEN_STATE = 'open';
const CLOSED_STATE = 'closed';

// custom functions to print logs 
function log (text) {
  console.log('Controller: ', text);
}

let garageState = '';
let connected = false;

client.on('connect', () => {
  client.subscribe('garage/connected');
  client.subscribe('garage/state');
})

client.on('message', (topic, message) => {
  switch (topic) {
    case 'garage/connected':
      return handleGarageConnected(message);
    case 'garage/state':
      return handleGarageState(message);
  }
  log(`No handler for topic: ${topic}`);
})

function handleGarageConnected (message) {
  log(`Garage connection status ${message}`);
  connected = (message.toString() === CONNECTED_STATUS);
}

function handleGarageState (message) {
  garageState = message.toString();
  log(`Garage state updated to: ${message.toString()}`);
}

function openGarageDoor () {
  // can only open door if we're connected to mqtt and door isn't already open
  if (connected && garageState !== OPEN_STATE) {
    client.publish('garage/open', TRUE_STATUS);
  }
}

function closeGarageDoor () {
  // can only close door if we're connected to mqtt and door isn't already closed
  if (connected && garageState !== CLOSED_STATE) {
    client.publish('garage/close', TRUE_STATUS);
  }
}

// simulate garage door
async function simulateDoors () {
  while (true) {
    await simulateOpenDoor();
    await simulateCloseDoor();
  }
}

// simulate opening garage door
function simulateOpenDoor () {
  return new Promise((res) => {
    setTimeout(async () => {
      log('open door');
      openGarageDoor();
      res();
    }, IDEAL_TIME_OUT);
  })
}

// simulate closing garage door
function simulateCloseDoor () {
  return new Promise((res) => {
    setTimeout(async () => {
      log('close door');
      closeGarageDoor();
      res();
    }, IDEAL_TIME_OUT);
  })
}

simulateDoors();