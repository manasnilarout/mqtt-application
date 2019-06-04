const mqtt = require('mqtt');

// connection parameters
const MQTT_URL = 'mqqt://0.0.0.0:3005';
const OPTIONS = {
  keepalive: 10,
  clean: true,
  clientId: 'mqttjs_garage',
  will: {
    topic: 'garage',
    payload: JSON.stringify({
      type: 'last-will',
      message: 'Disconnected unexpectedly.'
    }),
    qos: 2
  }
}

// connecting to client
const client = mqtt.connect(MQTT_URL, OPTIONS);

// constants
const TIMEOUT_DURATION = 2000;
const CLOSED = 'closed';
const OPENED = 'opened';
const CLOSING = 'closing';
const OPENING = 'opening';
const CONNECTED = {
  type: 'connection',
  status: 'connected'
};
const DISCONNECTED = {
  type: 'connection',
  status: 'disconnected'
};

function log (text) {
  console.log('Garage: ', text);
}

/**
 * The state of the garage, defaults to closed
 * Possible states : [closed, opening, open, closing]
 */
var state = CLOSED;

client.on('connect', () => {
  client.subscribe('garage-update');

  // Inform controllers that garage is connected
  client.publish('garage', JSON.stringify(CONNECTED));
  sendStateUpdate();
})

client.on('message', (topic, message) => {
  // parsing message
  let messageObject = {};
  try {
    messageObject = JSON.parse(message.toString());
  } catch (e) {
    log(`Encountered error: ${e.message}`);
  }
  switch (messageObject.status) {
    case 'open':
      return handleOpenRequest(messageObject);
    case 'close':
      return handleCloseRequest(messageObject);
  }
})

function sendStateUpdate () {
  log(`sending state ${state}`);
  const payLoadObject = {
    type: 'state',
    currentState: state
  }
  client.publish('garage', JSON.stringify(payLoadObject));
}

function handleOpenRequest () {
  if (state !== OPENED && state !== OPENING) {
    log('opening garage door');
    state = OPENING;
    sendStateUpdate();

    // simulate door open after 2 seconds (would be listening to hardware)
    setTimeout(() => {
      state = OPENED;
      sendStateUpdate();
    }, TIMEOUT_DURATION);
  }
}

let count = 0;
function handleCloseRequest () {
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
    }, TIMEOUT_DURATION);
  }
}
