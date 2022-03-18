// Node.js WebSocket server script
const http = require('http');
const WebSocketServer = require('websocket').server;
const server = http.createServer();
server.listen(9898);

////////////////////////////////////////////
// Require the pcf8574 module
const PCF8574 = require('pcf8574').PCF8574;
const i2cBus = require('i2c-bus').openSync(1);
const addr = 0x20;
const pcf = new PCF8574(i2cBus, addr, true);
// pcf.enableInterrupt(17);
pcf.inputPin(1, true)
.then(() => {
	console.log('3')
	return pcf.inputPin(3, true);
})
.then(() => {
	console.log('5')
	return pcf.inputPin(5, true);
})
.then(() => {
	console.log('6')
	return pcf.inputPin(6, false);
})
.then(() => {
	console.log('7')
	return pcf.inputPin(7, false);
})
pcf.on('input', (data) => {
	console.log('PCF input', data);
	if(data.pin === 1){
		
	}
});
// Handler for clean up on SIGINT (ctrl+c)
process.on('SIGINT', () => {
	pcf.removeAllListeners();
	pcf.disableInterrupt();
	console.log("SIGINT")
	process.on('exit', function(code) {
		return console.log(`About to exit with code ${code}`);
	});
	process.exit()
});

////////////////////////////////////////////

const nodaryEncoder = require('nodary-encoder');
// const myEncoder = nodaryEncoder(17, 18); // Using GPIO17 & GPIO18
// myEncoder.on('rotation', (direction, value) => {
//   	if (direction == 'R') {
//     	console.log('Encoder rotated right');
//   	} else {
//     	console.log('Encoder rotated left');
//   	}
// });

////////////////////////////////////////////

const wsServer = new WebSocketServer({
    httpServer: server
});

wsServer.on('request', function(request) {
    const connection = request.accept(null, request.origin);

	// var readline = require('readline');

	// readline.emitKeypressEvents(process.stdin);

	// if (process.stdin.isTTY)
	// 	process.stdin.setRawMode(true);

	// process.stdin.on('keypress', (chunk, key) => {
	// 	if (key.sequence === '\x03' && key.name === 'c') {
	// 		process.exit();
	// 	} else {
	// 		connection.sendUTF(key.name);
	// 	}
	// 	console.log(key)
	// });

    connection.on('message', function(message) {
      	console.log('Received Message:', message.utf8Data);
      	connection.sendUTF('Response from server!');
    });

    connection.on('close', function(reasonCode, description) {
        console.log('Client has disconnected.');
    });
});