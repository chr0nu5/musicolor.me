var ioc = require('socket.io-client'),
    tools = require('./tools');

var iocInstance;

module.exports = {
    sharedInstance: () => {
        return iocInstance || (iocInstance = ioc.connect(`${tools.socketServer}:${tools.socketPort}`));
    }
};
