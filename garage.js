const mqtt = require('mqtt');

// connection parameters
const MQTT_URL = 'mqqt://127.0.0.1';
const OPTIONS = {
  keepalive: 10,
  clean: true,
  clientId: 'mqttjs_garage',
  will: {
    topic: 'garage/last-will',
    payload: 'Disconnected unexpectedly',
    qos: 2
  }
}

// connecting to client
const client = mqtt.connect(MQTT_URL, OPTIONS);

// constants
const TWO_SECONDS = 2000;
const CLOSED = 'closed';
const OPENED = 'opened';
const CLOSING = 'closing';
const OPENING = 'opening';
const CONNECTED = 'connected';
const DISCONNECTED = 'disconnected';

function log (text) {
  console.log('Garage: ', text);
}

/**
 * The state of the garage, defaults to closed
 * Possible states : [closed, opening, open, closing]
 */
var state = CLOSED;

client.on('connect', () => {
  client.subscribe('garage/open');
  client.subscribe('garage/close');

  // Inform controllers that garage is connected
  client.publish('garage/connected', CONNECTED);
  sendStateUpdate();
})

client.on('message', (topic, message) => {
  log(`received message ${topic} ${message}`)
  switch (topic) {
    case 'garage/open':
      return handleOpenRequest(message);
    case 'garage/close':
      return handleCloseRequest(message);
  }
})

function sendStateUpdate () {
  log(`sending state ${state}`);
  client.publish('garage/state', state);
}

function handleOpenRequest (message) {
  if (state !== OPENED && state !== OPENING) {
    log('opening garage door');
    state = OPENING;
    sendStateUpdate();

    // simulate door open after 2 seconds (would be listening to hardware)
    setTimeout(() => {
      state = OPENED;
      sendStateUpdate();
    }, TWO_SECONDS);
  }
}

let count = 0;
function handleCloseRequest (message) {
  // Intentional error to check last will message
  ++count;
  log(count);
  if (count === 5) {
    throw new Error('Intentional Error');
  }
  if (state !== CLOSED && state !== CLOSING) {
    state = CLOSING;
    sendStateUpdate();

    // simulating door closed after 2 seconds (would be listening to hardware)
    setTimeout(() => {
      state = CLOSED;
      sendStateUpdate();
    }, TWO_SECONDS);
  }
}
