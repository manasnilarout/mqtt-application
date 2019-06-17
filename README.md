# MQTT Application
This is a sample application demonstrating the usage of **MQTT** broker application and protocol.

Here we are simulating a simple **Garage door** and **Controller** to handle garage door. Once both are connected to MQTT broker through MQTT client, they can communicate over MQTT protocol.

Controller will continuously try to open and close the door on a certain time difference, and garage has to respond back with action it is performing when it receives a message from controller.

## Requisites
- Node.js(version 8 or above)
- Mosquitto MQTT broker
  - Mosquitto can be downloaded from [here](https://mosquitto.org/download/).
  - Choose appropriate OS and download/follow the instructions mentioned to get it installed.

## Code setup
- Install all dependencies with command `npm i`.
- Install `MQTT` broker.
  - In order to use custom configurations for mosquitto please use following command while starting the broker,
    - `mosquitto -v -c mosquitto.conf` (-c or --config parameter expects the configuration file path)
- Start the broker and replace connection parameter in `controller` and `garage` code.
- Start controller code first then start garage code using below commands.
  - You need to run below commands in two different terminals see clear logs.
  - `npm run controller` (To start controller app)
  - `npm run garage` (To start garage app)

## Branch setup
Different branches have been created to show different usage of MQTT functionalities, those can be found here:
1. [master](https://github.com/manasnilarout/mqtt-application): Simple usage of MQTT broker and client.
2. [lwt-test](https://github.com/manasnilarout/mqtt-application/tree/lwt-test): Demonstrating the usage of **Last Will and Testament**.
    - Here an exception is thrown intentionally to show that when a client is disconnected LWT message is broadcasted by MQTT broker and all the subscribers, subscribed to LWT topic will get last will message.
3. [persistance-test](https://github.com/manasnilarout/mqtt-application/tree/persistance-test): Demonstrating persistence capabilities of **Mosquitto MQTT broker**.
    - In order to see this in action please use the config attached in above branch and start broker with custom config as described [here](https://github.com/manasnilarout/mqtt-application#code-setup).
    - Here an exception is thrown after few loops in garage code but controller keeps on sending update door commands.
    - Once garage code is stopped because of exception let the controller run for sometime.
    - Stop the broker and start it again, now start garage code, you should see that all the messages broadcasted by controller should reach garage even though the broker has been restarted.
4. [topics-test](https://github.com/manasnilarout/mqtt-application/tree/topics-test): Demonstrating usage of less number of topics for different purposes. Here we have only two topics for all operations.