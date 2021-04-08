var os = require('os');
var tools = require('./lib/tools');

var ioc = require('socket.io-client'),
    client = ioc.connect(`${tools.socketServer}:${tools.socketPort}`);

var tools = require('./lib/tools');
var SerialPort = require("serialport");

var serial_enabled = true;

var beats_per_second = tools.beatsPerSecond; //the same value needs to be on tools.js to sync
var serialPort;
var buffer = undefined;
var cache_buffer = undefined;
var QUEUE = [];
var timer = undefined;

function createBuffer(list) {
    var tmp_buffer = new Buffer(list.length);
    list.forEach((item, index) => {
        tmp_buffer[index] = item
    });
    return tmp_buffer;
}

function writeBuffer(tmp_buffer) {
    if (serialPort.isOpen()) {
        serialPort.write(tmp_buffer, (err, results) => {
            if (err) {
                console.log(`serial error: ${err}`);
            }
            tools.logger(buffer);
        });
    } else {
        if (serial_enabled) {
            serialPort.open((error) => {
                if (error) {
                    console.log('failed to open: ' + error);
                }
            });
        }else{
            console.log('CNSL', buffer);
        }
    }
}

client.on('connect', function() {
        console.log('Connected to port 3030');
        timer = setTimeout(SerialWrite, 900 / tools.beatsPerSecond);
    })
    .on('disconnect', function() {
        console.log('Disconnected from port 3030');
        clearTimeout(timer);
    })
    .on('queue', function(msg) {
        QUEUE.push(msg);
    })
    .on('finish', function(msg) {
        QUEUE = QUEUE.filter((item) => {
            return item.u !== msg.u;
        });
    });

function SerialWrite() {
    //console.log(QUEUE.length);
    var tmp_buffer = [];
    var AMPS = new Array(24 + 1).join('0').split('').map(parseFloat);
    tmp_buffer.push(0x6B);
    tmp_buffer.push(0x8D);
    var color = undefined;
    QUEUE.forEach((item, index) => {
        if ('c' in item && item.p === 0 && !color) {
            item.p = 1;
            color = item;
        }
    });
    if (color) {
        //tmp_buffer.push(0xCC);
        tmp_buffer.push(color.i);
        tmp_buffer.push(color.c);
    } else {
        //tmp_buffer.push(0xCC);
        tmp_buffer.push(AMPS.length + 1);
        tmp_buffer.push(0);
    }
    //tmp_buffer.push(0xCA);
    QUEUE.forEach((item, index) => {
        if ('a' in item) {
            AMPS[item.i] = parseInt(item.a);
            item.p = 1;
        }
    });
    AMPS.forEach((item, index) => {
        tmp_buffer.push(item);
    });
    //tools.logger(`QUEUE BEFORE ${JSON.stringify(QUEUE)}`);
    QUEUE = QUEUE.filter((item) => {
        return item.p === 0;
    });
    //tools.logger(`QUEUE AFTER ${JSON.stringify(QUEUE)}`);
    if (JSON.stringify(tmp_buffer) !== cache_buffer) {
        buffer = createBuffer(tmp_buffer);
        writeBuffer(buffer);
        cache_buffer = JSON.stringify(tmp_buffer);
    }
    timer = setTimeout(SerialWrite, 900 / tools.beatsPerSecond);
}

function initSerial() {
    // SerialPort.list(function(err, ports) {
    //     ports.forEach(function(port) {
    //         console.log(`\n${port.comName}, ${port.pnpId}, ${port.manufacturer}`);
    //     });
    // });
    var port = "/dev/ttyACM0"
        // add more cases
    if (os.hostname() === "Elliot-Alderson.local") {
        port = "/dev/cu.usbmodem1412"
    }
    serialPort = new SerialPort.SerialPort(port, {
            // same as the embed hardware
            baudrate: 230400
        })
        .on('error', (err) => {
            if (err) {
                console.log(`serial error: ${err}`);
            }
            serial_enabled = false;
        });
}

initSerial();
