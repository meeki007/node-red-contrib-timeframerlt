node-red-contrib-timeframe-rate-limit-trigger
=========================

[![GitHub version](https://badge.fury.io/gh/eisbehr-%2Fnode-red-throttle.svg)](http://github.com/eisbehr-/node-red-throttle)
[![NPM version](https://badge.fury.io/js/node-red-contrib-throttle.svg)](http://www.npmjs.org/package/node-red-contrib-throttle)
[![Dependencies Status](https://david-dm.org/eisbehr-/node-red-throttle/status.svg)](https://david-dm.org/eisbehr-/node-red-throttle)

A <a href="http://nodered.org" target="_new">Node-RED</a> A Trigger and Rate Limit Node to pass messages if user count has been met within a defined user time frame.

---

## Table of Contents
* [Install](#install)
* [Usage](#usage)
  * [Timeframe](#by-time)
  * [Count Persistent](#count-persistent)
  * [Count Terminable](#count-terminable)
* [Example Flows](#example-flows)
  * [Example by Count Persistent](#example-by-count-persistent)
  * [Example by Count Terminable](#example-by-count-terminable)
* [Bugs / Feature request](#bugs--feature-request)
* [License](#license)
* [Work](#work)

---

## Install

Run the following command in your Node-RED user directory - typically `~/.node-red`:

```
npm install node-red-contrib-timeframe-rate-limit-trigger
```


## Usage

A Trigger and Rate Limit Node to pass messages if user count has been met within a defined user time frame.
Just insert the node in between two others. Then the ammount of messages received in a certain time frame to trigger can be limited by different parameter selections.


### Timeframe

Amount of time given before message trigger event is reset.
**For example:** setting the node to `10 seconds` means, that you have ten seconds to reach enough messages to trigger one message to be forwarded.


### Count Persistent

Ammount of messages needed to trigger before one message is passed through. Persistent, If triggered the count is reset and it can be triggered again.
**For example:** setting the node to a count of `5` means, that five messages are needed within the specified timeframe before one message will be forwarded.


### Count Terminable

Will only pass through a single message, ONCE! Hence Terminable. When the ammount of messages needed active the trigger is reached. The trigger can be reset to send message when conditions are met again with `msg.reset`.
**For example:** setting the node to a count of `5` means, that five messages are needed within the specified timeframe before one message will be forwarded Once, One time, and never again, even if conditions are met again.


## Example Flows

Simple examples showing how to use the timeframe-rate-limit-trigger and it's output.


### Example by Count Persistent

![example1.png](./doc/example1.png)

```JSON
[{"id":"81be4802.e74478","type":"function","z":"8a25646f.9d541","name":"info msg","func":"msg.payload = \"injected\";\nreturn msg;","outputs":1,"noerr":0,"x":800,"y":60,"wires":[["789ee5ac.32e214"]]},{"id":"789ee5ac.32e214","type":"debug","z":"8a25646f.9d541","name":"output","active":true,"console":"false","complete":"payload","x":950,"y":80,"wires":[]},{"id":"99fbadf5.9b42e8","type":"throttle","z":"8a25646f.9d541","name":"","throttleType":"time","timeLimit":"3","timeLimitType":"seconds","countLimit":"3","blockSize":0,"locked":false,"x":800,"y":100,"wires":[["789ee5ac.32e214"]]},{"id":"681f30ee.8f3598","type":"inject","z":"8a25646f.9d541","name":"inject","topic":"","payload":"!!! PASSED THROUGH !!!","payloadType":"str","repeat":"","crontab":"","once":false,"x":650,"y":80,"wires":[["99fbadf5.9b42e8","81be4802.e74478"]]}]
```


### Example by Count Terminable

![example2.png](./doc/example2.png)

```JSON
[{"id":"a3d7f710.99f97","type":"debug","z":"8a25646f.9d541","name":"output","active":true,"console":"false","complete":"payload","x":950,"y":200,"wires":[]},{"id":"e2c6599a.0b5c98","type":"function","z":"8a25646f.9d541","name":"info msg","func":"msg.payload = \"injected\";\nreturn msg;","outputs":1,"noerr":0,"x":800,"y":180,"wires":[["a3d7f710.99f97"]]},{"id":"8a2c177f.24e0c8","type":"throttle","z":"8a25646f.9d541","name":"","throttleType":"count","timeLimit":"10","timeLimitType":"seconds","countLimit":"3","blockSize":0,"locked":false,"x":800,"y":220,"wires":[["a3d7f710.99f97"]]},{"id":"836ebd21.ad25","type":"inject","z":"8a25646f.9d541","name":"inject","topic":"","payload":"!!! PASSED THROUGH !!!","payloadType":"str","repeat":"","crontab":"","once":false,"x":650,"y":200,"wires":[["8a2c177f.24e0c8","e2c6599a.0b5c98"]]}]
```


## Bugs / Feature request
Please [report](http://github.com/meeki007/node-red-contrib-timeframe-rate-limit-trigger/issues) bugs and feel free to [ask](http://github.com/meeki007/node-red-contrib-timeframe-rate-limit-trigger/issues) for new features directly on GitHub.


## License
This project is licensed under [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0) license.


## Work
_Need a node?
_Need automation work?
_Need computers to flip switches?
  
Contact me at meeki007@gmail.com


Thanks to [SunValleyFoods](https://www.sunvalleyfoods.com/) for being a buisness that supports opensource. They needed this node for a tempsensor monitoring and automation project for their freezers and cooers.

Thanks to allot of code written by Daniel 'Eisbehr' Kern and his [node-red-contrib-throttle](http://github.com/eisbehr-/node-red-throttle). I based and copied allot of code off his work as his node did not quite do what i needed.




end.
