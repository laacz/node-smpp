/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var assert = require('assert');
var packunpack = require('../lib/packunpack.js');
var pack = packunpack.pack;
var unpack = packunpack.unpack;

/* Tests */
assert.strictEqual(pack('nc*', 0x1234, 65, 66).toString('binary'), "\x12\x34\x41\x42");
assert.strictEqual(pack('N', 167).toString('binary'), "\x00\x00\x00\xa7");
assert.strictEqual(pack('N', 1677866).toString('binary'), "\x00\x19\x9a\x2a");
assert.strictEqual(pack('N', 1678191).toString('binary'), "\x00\x19\x9b\x6f");

assert.deepEqual(unpack('nc*', "\x12\x34\x41\x42"), [0x1234, 65, 66]);
assert.deepEqual(unpack('N', "\x00\x00\x00\xa7"), 167);
assert.deepEqual(unpack('N', "\x00\x19\x9a\x2a"), 1677866);
assert.deepEqual(unpack('N', "\x00\x19\x9b\x6f"), 1678191);
