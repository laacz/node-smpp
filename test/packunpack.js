/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var Assert = require('assert');
var packunpack = require('packunpack');
var pack = packunpack.pack;
var unpack = packunpack.unpack;

function toString(array) {
    return array.map(function(a){return String.fromCharCode(a);}).join('');
}

/* Tests */
module.exports = {
    'Pack': function() {
        Assert.strictEqual(pack('nc*', 0x1234, 65, 66).toString('binary'), toString([0x12, 0x34, 0x41, 0x42]));
        Assert.strictEqual(pack('N', 167).toString('binary'), toString([0x00, 0x00, 0x00, 0xa7]));
        Assert.strictEqual(pack('N', 1677866).toString('binary'), toString([0x00, 0x19, 0x9a, 0x2a]));
        Assert.strictEqual(pack('N', 1678191).toString('binary'), toString([0x00, 0x19, 0x9b, 0x6f]));
    },
    'Unpack': function() {
        Assert.eql(unpack('nc*', toString([0x12, 0x34, 0x41, 0x42])), [0x1234, 65, 66]);
        Assert.eql(unpack('N', toString([0x00, 0x00, 0x00, 0xa7])), 167);
        Assert.eql(unpack('N', toString([0x00, 0x19, 0x9a, 0x2a])), 1677866);
        Assert.eql(unpack('N', toString([0x00, 0x19, 0x9b, 0x6f])), 1678191);
    }
};

