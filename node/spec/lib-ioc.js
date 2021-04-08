var sinon = require("sinon"),
    ioc = require('socket.io-client'),
    socket = require('../lib/ioc.js'),
    expect = require('chai').expect;

describe('Ioc', function() {
    var iocStub;

    before(function() {
        iocStub = sinon.stub(ioc, 'connect', function(url) {
            return true;
        });
    });

    after(function() {
        iocStub.restore();
    });

    describe('socket connection', function() {
        it('should not fail', function() {
            expect(socket.sharedInstance()).to.be.true;
        });
    });
});
