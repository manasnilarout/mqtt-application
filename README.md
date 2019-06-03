# mqtt-application
This is a sample application demonstrating the usage of **MQTT** protocol. Here we are simulating a simple **controller** and a **garage**.

## Requisites
- Node.js(version 8 or above)
- Any MQTT broker

## Code setup
- Install all dependencies with command `npm i`.
- Install any `MQTT` broker(preferrably `mosquitto` or `EMQ`)
- Start the broker and replcae connection parameter in `controller` and `garage` code.
- Start controller code fisrt then start garage code using command `node {{file name}}`.
