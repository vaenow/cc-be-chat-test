const { EOL } = require('os');
const conf = require('dotenv').load();
const WebSocket = require("ws");
const WebSocketApi = require("../utils/ws");

if (conf.parsed && conf.parsed.APP_ID === '') {
  throw new Error(' APP_ID not configured!');
}
/* eslint-disable */
console.log(EOL + '============CONFIG============');
for (let k in process.env) {
  console.log(`${k}\t${process.env[k]}`);
}
console.log('==============================' + EOL);

let PORT = process.env.API_PORT || 3000;
const server = require('../app').listen(PORT);

// ws
const wss = new WebSocket.Server({ server });
WebSocketApi(wss);

console.log(`${EOL} ws starting at port ${PORT}`);

/* eslint-enable */
