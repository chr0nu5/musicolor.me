var sinon = require("sinon"),
    expect = require('chai').expect,
    assert = require('chai').assert;

var Moods = require("../lib/moods");

describe('Moods', function() {
    var mood;
    before(function() {
        mood = new Moods();
    });

    describe('moods should be a list', function() {
        it('should not fail', function() {
            expect(mood.moods).to.be.instanceof(Array);
        });
    });

    describe('Deg2Rad should be a number', function() {
        it('should not fail', function() {
            assert.isNumber(mood.Deg2Rad(3));
        });
    });

    describe('Deg2Rad should not be a string', function() {
        it('should fail', function() {
            expect(mood.Deg2Rad('a')).to.be.false;
        });
    });

    describe('PythagorasEquirectangular should be a number', function() {
        it('should not fail', function() {
            assert.isNumber(mood.PythagorasEquirectangular(1, 2, 3, 4));
        });
    });

    describe('PythagorasEquirectangular parameter should not be a string', function() {
        it('should fail first', function() {
            expect(mood.PythagorasEquirectangular('a', 1, 2, 3)).to.be.false;
        });
        it('should fail second', function() {
            expect(mood.PythagorasEquirectangular(1, 'a', 2, 3)).to.be.false;
        });
        it('should fail third', function() {
            expect(mood.PythagorasEquirectangular(1, 2, 'a', 3)).to.be.false;
        });
        it('should fail fourth', function() {
            expect(mood.PythagorasEquirectangular(1, 2, 3, 'a')).to.be.false;
        });
        it('should fail all', function() {
            expect(mood.PythagorasEquirectangular('a', 'a', 'a', 'a')).to.be.false;
        });
    });

    describe('NearestFeeling should return keys', function() {
        it('should not fail', function() {
            expect(mood.NearestFeeling({"energy":0.5, "valence": 0.5})).to.have.all.keys(['color','colorIndex','energy','mood','valence']);
        });
    });

    describe('NearestFeeling should receive an object', function() {
        it('should fail', function() {
            expect(mood.NearestFeeling('bla')).to.be.false;
        });
    });

})
