/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Assert = require('assert');

// node-smpp
var packunpack = require('../lib/packunpack.js');
var pack = packunpack.pack;
var unpack = packunpack.unpack;

function toString(array) {
    return array.map(function(a){return String.fromCharCode(a);}).join('');
}

/* Tests */
module.exports = {
    'pack: multipliers': function() {
        Assert.strictEqual(pack('nc*', 0x1234, 65, 66).toString('binary'), toString([0x12, 0x34, 0x41, 0x42]));
        Assert.strictEqual(pack('c2', 1, 2).toString('binary'), toString([0x01, 0x02]));
        Assert.strictEqual(pack('c10', 1, 2, 3, 4, 5, 6, 7, 8, 9, 10).toString('binary'), toString([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a]));
    },
    'pack: small N': function() {
        Assert.strictEqual(pack('N', 167).toString('binary'), toString([0x00, 0x00, 0x00, 0xa7]));
    },
    'pack: large N': function() {
        Assert.strictEqual(pack('N', 1677866).toString('binary'), toString([0x00, 0x19, 0x9a, 0x2a]));
        Assert.strictEqual(pack('N', 1678191).toString('binary'), toString([0x00, 0x19, 0x9b, 0x6f]));
    },
    'pack: exceptions': function() {
        Assert.throws(function(){pack('Z', 1);});
        Assert.throws(function(){pack('NN', 1);;});
    },
    'unpack: multipliers mix': function() {
        Assert.eql(unpack('n2c*', toString([0x12, 0x34, 0x13, 0x35, 0x41, 0x42])), [0x1234, 0x1335, 0x41, 0x42]);
    },
    'unpack: asterisk multiplier': function() {
        Assert.eql(unpack('n*', toString([0x12, 0x34, 0x13, 0x35, 0x41, 0x42])), [0x1234, 0x1335, 0x4142]);
        Assert.eql(unpack('N*', toString([0x12, 0x34, 0x13, 0x35])), 0x12341335);
    },
    'unpack: small multiplier': function() {
        Assert.eql(unpack('N2', toString([0x00, 0x00, 0x00, 0xa7, 0x00, 0x00, 0x00, 0xa8])), [167, 168]);
    },
    'unpack: large multiplier': function() {
        Assert.eql(unpack('c10', toString([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a])), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    },
    'unpack: small N': function() {
        Assert.eql(unpack('N', toString([0x00, 0x00, 0x00, 0xa7])), 167);
    },
    'unpack: large N': function() {
        Assert.eql(unpack('N', toString([0x00, 0x19, 0x9a, 0x2a])), 1677866);
        Assert.eql(unpack('N', toString([0x00, 0x19, 0x9b, 0x6f])), 1678191);
    },
    'unpack: unknown format instruction': function() {
        var error; try { error = false; unpack('Z', "\x65"); } catch (e) { error = e; } Assert.ok(error !== false);
    },
    'unpack: input too short': function() {
        Assert.throws(function(){unpack('NN', "\x65");});
        Assert.throws(function(){unpack('c', "");});
        Assert.throws(function(){unpack('n*', "\x65");});
        Assert.throws(function(){unpack('n', "\x65");});
    }
};
