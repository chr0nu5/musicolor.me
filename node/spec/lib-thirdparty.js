var sinon = require("sinon"),
    SpotifyWebApi = require('spotify-web-api-node'),
    LastFmApi = require('lastfmapi'),
    LastFmApiNode = require('lastfm').LastFmNode,
    tools = require('../lib/tools.js'),
    proxyquire = require('proxyquire').noPreserveCache(),
    expect = require('chai').expect;

var ua = (function() {
    var _this = this;
    this.eventCalled = 0;
    var saveSpy = sinon.spy(function() {
        return true;
    });
    var eventSpy = sinon.spy(function(instance, arguments) {
        _this.eventCalled += 1;
        if (_this.eventCalled === 2) {
            return undefined;
        }
        if (_this.eventCalled === 3) {
            throw new Error('catch');
        }
        return {
            save: saveSpy
        }
    });
    eventSpy.saveSpy = saveSpy;
    var mainSpy = sinon.spy(function() {
        return {
            event: eventSpy
        };
    });
    mainSpy.eventSpy = eventSpy;
    return mainSpy;
})();

var thirdparty = proxyquire('../lib/thirdparty.js', {
    'universal-analytics': ua
});

describe('Thirdparty', function() {
    describe('getSpotifyApi new SpotifyWebApi', function() {
        var spotifyStub;
        before(function() {
            spotifyStub = sinon.createStubInstance(SpotifyWebApi);
        });

        it('should create a new instance', function() {
            expect(thirdparty.getSpotifyApi()).to.respondTo('setAccessToken');
        });
    });

    describe('getLastFmApi new LastFmApi', function() {
        var lastfmStub;
        before(function() {
            lastfmStub = sinon.createStubInstance(LastFmApi);
        });

        it('should create a new instance', function() {
            expect(thirdparty.getLastFmApi()).to.respondTo('getAuthenticationUrl');
        });
    });

    describe('getLastfmNodeApi new LastFmApiNode', function() {
        var lastfmStub;
        before(function() {
            lastfmStub = sinon.createStubInstance(LastFmApiNode);
        });

        it('should create a new instance', function() {
            expect(thirdparty.getLastfmNodeApi()).to.respondTo('stream');
        });
    });

    describe('recordUAEvent register an UA event without key', function() {
        var oldToolAnalitycsKey = tools.analyticsKey;
        before(function() {
            tools.analyticsKey = '';
            thirdparty.recordUAEvent();
        });

        after(function() {
            tools.analyticsKey = oldToolAnalitycsKey;
        });

        it('ua.event should not be called', function() {
            expect(ua.eventSpy.called).to.be.false;
        });
    });

    describe('recordUAEvent register and save a event', function() {
        var oldToolAnalitycsKey = tools.analyticsKey;
        before(function() {
            tools.analyticsKey = 'UAKEY';
            thirdparty.recordUAEvent();
        });

        after(function() {
            tools.analyticsKey = oldToolAnalitycsKey;
        });

        it('ua.event.save should be called', function() {
            expect(ua.eventSpy.saveSpy.called).to.be.true;
        });
    });

    describe('recordUAEvent is undefined', function() {
        it('should fail', function() {
            expect(thirdparty.recordUAEvent()).to.be.an('undefined');
        });
    });

    describe('recordUAEvent any error', function() {
        it('should fail', function() {
            expect(thirdparty.recordUAEvent()).to.be.an('undefined');
        });
    });

});
