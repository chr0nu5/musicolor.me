var sinon = require("sinon"),
    MongoClient = require('mongodb').MongoClient,
    expect = require('chai').expect,
    assert = require('chai').assert;

var Mongo = require("../lib/mongo");

describe('Mongo', function() {
    describe('initPool when MongoClient fails', function() {
        var mongoStub,
            sandbox;
        before(function() {
            sandbox = sinon.sandbox.create();
            mongoStub = sandbox.stub(MongoClient, 'connect', function(url, options, callback) {
                callback(new Error('Generic Error'));
            });
        });

        after(function() {
            sandbox.restore();
        });

        it('should fail', function() {
            expect(Mongo.initPool).to.Throw();
        });
    });

    describe('initPool when MongoClient succed', function() {
        var mongoStub,
            sandbox;
        before(function() {
            sandbox = sinon.sandbox.create();
            mongoStub = sandbox.stub(MongoClient, 'connect', function(url, options, callback) {
                return true;
            });
        });

        after(function() {
            sandbox.restore();
        });

        it('should not fail', function() {
            expect(Mongo.initPool).to.not.Throw();
        });
    });

    describe('initPool when MongoClient succed with callback', function() {
        var mongoStub,
            sandbox;
        before(function() {
            sandbox = sinon.sandbox.create();
            mongoStub = sandbox.stub(MongoClient, 'connect', function(url, options, callback) {
                callback();
            });
        });

        after(function() {
            sandbox.restore();
        });

        it('should not fail', function() {
            expect(Mongo.initPool(function() {
                return true;
            })).to.not.Throw();
        });
    });

    describe('getInstance when MongoClient succeed', function() {
        var mongoStub,
            sandbox;
        before(function() {
            sandbox = sinon.sandbox.create();
            mongoStub = sandbox.stub(MongoClient, 'connect', function(url, options, callback) {
                callback();
            });
        });

        after(function() {
            sandbox.restore();
        });

        it('should not fail', function() {
            expect(Mongo.getInstance).to.not.Throw();
        });
    });

    describe('getInstance when MongoClient has ben initiated', function() {
        var mongoStub,
            sandbox;
        before(function() {
            sandbox = sinon.sandbox.create();
            mongoStub = sandbox.stub(MongoClient, 'connect', function(url, options, callback) {
                callback(false, true);
            });
            Mongo = Mongo.initPool();
        });

        after(function() {
            sandbox.restore();
        });

        it('should not fail', function() {
            expect(function() {
                Mongo.getInstance(function(p_db) {
                    return p_db;
                });
            }).to.not.Throw();
        });

        it('should fail without callback', function() {
            expect(function() {
                Mongo.getInstance();
            }).to.Throw();
        });
    });

});
