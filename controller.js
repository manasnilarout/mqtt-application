const mqtt = require('mqtt');
const client = mqtt.connect('mqqt://0.0.0.0:3005');

// constants
const IDEAL_TIME_OUT = 5000;
const OPEN_DOOR = {
  type: 'garage',
  status: 'open'
};
const CLOSE_DOOR = {
  type: 'garage',
  status: 'close'
};
const CONNECTED_STATUS = 'connected';
const OPEN_STATE = 'open';
const CLOSED_STATE = 'closed';

function log (text) {
  console.log('Controller: ', text);
}

var garageState = '';
var connected = false;

client.on('connect', () => {
  client.subscribe('garage');
})

client.on('message', (topic, message) => {
  let messageObject = {};
  try {
    messageObject = JSON.parse(message.toString());
  } catch (e) {
    log(`Got an error: ${e.message}`);
  }
  switch (messageObject.type) {
    case 'connection':
      return handleGarageConnected(messageObject);
    case 'state':
      return handleGarageState(messageObject);
    case 'last-will':
      return handleDisconnection(messageObject);
  }
  log(`No handler for topic: ${messageObject.type}`);
});

function handleGarageConnected (message) {
  log(`Garage connection status ${message.status}`);
  connected = (message.status === CONNECTED_STATUS);
}

function handleGarageState (message) {
  garageState = message.currentState;
  log(`Garage state updated to: ${garageState}`);
}

function handleDisconnection (message) {
  log(`Garage got disconnected with message ${message.message}`);
}

function openGarageDoor () {
  // can only open door if we're connected to mqtt and door isn't already open
  if (connected && garageState !== OPEN_STATE) {
    client.publish('garage-update', JSON.stringify(OPEN_DOOR));
  }
}

function closeGarageDoor () {
  // can only close door if we're connected to mqtt and door isn't already closed
  if (connected && garageState !== CLOSED_STATE) {
    client.publish('garage-update', JSON.stringify(CLOSE_DOOR));
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