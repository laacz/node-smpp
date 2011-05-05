/**
 * This file is part of NodeJS SMPP library
 *
 * @author Kaspars Foigts <laacz@laacz.lv>
 * @license The MIT License
 * @copyright Copyright(c) 2011 - present Kaspars Foigts <laacz@laacz.lv>
 */

var PDUFactory = require('../lib/pdu-factory.js');
var Assert = require('assert');

// Malformed PDUs
var p = PDUFactory.fromBuffer('', function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromBuffer('\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00', function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromBuffer(Buffer('\x00\x00\x00\x10\xff\xff\xff\xff\x00\x00\x00\x00\x00\x00\x00\x01', 'binary'), function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromBuffer(Buffer('\x00\x00\x00\x10\x00\x00\x00\x01\xff\xff\xff\xff\x00\x00\x00\x01', 'binary'), function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromBuffer(Buffer('\x00\x00\x00\x10\x00\x00\x00\x21\x00\x00\x00\x00\x00\x00\x00\x01', 'binary'), function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});

// Correct bind_transceiver
var p = PDUFactory.fromBuffer(Buffer("\x00\x00\x00\x2b\x00\x00\x00\x09\x00\x00\x00\x00\x00\x19\x9b\x6ffoofoofo\x00barbarba\x00\x45\x53\x4d\x45\x00\x34\x00\x00\x00", 'binary'), function(err, pdu) { Assert.ok(pdu !== null); console.log('[ok]', pdu.command_name, pdu.command_status_name)});

// Correct submit_sm
var p = PDUFactory.fromBuffer(Buffer("\x00\x00\x00\xa6\x00\x00\x00\x04\x00\x00\x00\x00\x00\x19\xa6\xf9\x00\x05\x00\x4b\x4b\x4b\x4b\x4b\x20\x4b\x4b\x4b\x4b\x00\x01\x00\x33\x37\x31\x32\x32\x32\x32\x32\x32\x32\x32\x00\x00\x00\x03\x00\x30\x30\x30\x30\x30\x37\x30\x30\x30\x30\x30\x30\x30\x30\x30\x52\x00\x01\x00\x00\x00\x54\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x15\x05\x00\x02\x54\x53\x15\x03\x00\x02\x00\xab", 'binary'), function(err, pdu) { Assert.ok(err === null); console.log('[ok]', pdu.command_name, pdu.command_status_name)});


// Sanity checks
var p = PDUFactory.fromStruct(-1, -1, -1, {}, function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromStruct(4, -1, -1, {}, function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});
var p = PDUFactory.fromStruct(4, 0, -1, {}, function(err, pdu) { Assert.ok('message' in err); console.log('[ok]', err.message)});

var p = PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys'}, function(err, pdu) { Assert.ok(err === null); console.log('[ok]', pdu.command_name, pdu.command_status_name)});

var p = PDUFactory.fromStruct(0x80000009, 0, -1, {'system_id': 'sys', 'additional_status_info_text' : 'foobar'}, function(err, pdu) { Assert.ok(pdu.optional.additional_status_info_text === 'foobar'); console.log('[ok]', pdu.command_name, pdu.command_status_name)});


// Back and back again
var bufs = [
            "\x00\x00\x00\x2b\x00\x00\x00\x09\x00\x00\x00\x00\x00\x19\x9b\x6ffoofoofo\x00barbarba\x00\x45\x53\x4d\x45\x00\x34\x00\x00\x00",
            "\x00\x00\x00\xa6\x00\x00\x00\x04\x00\x00\x00\x00\x00\x19\xa6\xf9\x00\x05\x00\x4b\x4b\x4b\x4b\x4b\x20\x4b\x4b\x4b\x4b\x00\x01\x00\x33\x37\x31\x32\x32\x32\x32\x32\x32\x32\x32\x00\x00\x00\x03\x00\x30\x30\x30\x30\x30\x37\x30\x30\x30\x30\x30\x30\x30\x30\x30\x52\x00\x01\x00\x00\x00\x54\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x53\x15\x05\x00\x02\x54\x53\x15\x03\x00\x02\x00\xab"
           ];


for (buf in bufs) {
    var p = PDUFactory.fromBuffer(Buffer(bufs[buf], 'binary'), function(err, pdu) {
        var params = pdu.mandatory;
        for (var k in pdu.optional) {
            params[k] = pdu.optional[k];
        }
        PDUFactory.fromStruct(pdu.header.command_id, pdu.header.command_status, pdu.header.sequence_number, params, function(err, pdu2) {
            Assert.ok(pdu2.buffer.toString() === pdu.buffer.toString())
        })
    });
}
// console.log(msg.split('').reduce(function(a, b){ return (a.length == 1 ? '\\x' + a.charCodeAt(0).toString(16) : a) + '\\x' + b.charCodeAt(0).toString(16);}))


/*
 <Buffer 00 00 00 2b 00 00 00 09 00 00 00 00 00 19 fd 6f 66 6f 6f 66 6f 6f 66 6f 00 62 61 72 62 61 72 62 61 00 45 53 4d 45 00 34 00 00 00>
*/
